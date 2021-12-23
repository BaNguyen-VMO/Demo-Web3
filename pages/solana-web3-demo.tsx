import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/SolanaWeb3Page.module.css';
import { Button, Input } from 'components';
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SendOptions,
  SystemProgram,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import spinner from '/public/spinner.svg';
import { formatAddress } from 'utils/helps';

type PhantomEvent = 'disconnect' | 'connect';
interface PhantomProvider {
  publicKey: PublicKey;
  secretKey: any;
  isConnected: boolean;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signAndSendTransaction: (
    transaction: Transaction,
    options?: SendOptions,
  ) => Promise<{ signature: string }>;
  connect: (opts?: any) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
}

const SolanaWeb3Page: NextPage = () => {
  const [account, setAccount] = useState<PhantomProvider | undefined>(undefined);
  const [provider, setProvider] = useState<PhantomProvider | undefined>(undefined);
  const [balanceOfAccount, setBalanceOfAccount] = useState<number | undefined>(0);
  const [isLoading, setLoading] = useState(false);

  const [recipientAddress, setRecipientAddress] = useState('');

  useEffect(() => {
    const getProvider = (): PhantomProvider | undefined => {
      if (window && 'solana' in window) {
        const anyWindow: any = window;
        const provider = anyWindow.solana;
        if (provider.isPhantom) {
          return provider;
        }
      }
      window.open('https://phantom.app/', '_blank');
    };

    setProvider(getProvider());

    if (provider) {
      provider.on('connect', () => {
        setAccount(provider);
      });

      provider.on('disconnect', () => {
        setAccount(undefined);
      });
    }
  }, [provider]);

  useEffect(() => {
    document.addEventListener('load', () => {
      setAccount(undefined);
    });

    return () => {
      document.removeEventListener('load', () => {});
    };
  }, []);

  const connectToWallet = async () => {
    await provider?.connect();
  };

  const getBalance = async (publicKey: PublicKey) => {
    try {
      const connection = new Connection(clusterApiUrl('devnet'));
      const lamports = await connection.getBalance(publicKey);
      setBalanceOfAccount(lamports / LAMPORTS_PER_SOL);

      return lamports / LAMPORTS_PER_SOL;
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (account?.publicKey) {
      getBalance(account.publicKey);
    }
  }, [account]);

  const requestAirdrop = async (publicKey: PublicKey | null) => {
    if (publicKey) {
      setLoading(true);

      const connection = new Connection(clusterApiUrl('devnet'));
      const airdropSignature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
      await connection.confirmTransaction(airdropSignature);
      const newBalance = await getBalance(publicKey);
      setBalanceOfAccount(newBalance);

      setLoading(false);
    }
  };

  const handleSendCoin = async () => {
    if (account) {
      const connection = new Connection(clusterApiUrl('devnet'));
      const recipientAccountAddress = new PublicKey(recipientAddress);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: account.publicKey,
          toPubkey: recipientAccountAddress,
          lamports: LAMPORTS_PER_SOL,
        }),
      );

      // Setting the variables for the transaction
      transaction.feePayer = account.publicKey;
      const blockhashObj = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhashObj.blockhash;

      // Transaction constructor initialized successfully
      if (transaction) {
        console.log('Txn created successfully');
      }

      // Request creator to sign the transaction (allow the transaction)
      const signed = await account.signTransaction(transaction);
      // The signature is generated
      const signature = await connection.sendRawTransaction(signed.serialize());
      // Confirm whether the transaction went through or not
      await connection.confirmTransaction(signature);

      //Signature or the txn hash
      console.log('Signature: ', signature);
    }
  };

  return (
    <>
      <Head>
        <title>Solana-Web3 Demo</title>
      </Head>
      <div>
        {!account ? (
          <Button onClick={connectToWallet}>Connect Wallet</Button>
        ) : (
          <div className={styles.center}>
            <p>
              <b>Account Address: </b>
              {account.publicKey && formatAddress(account.publicKey.toBase58())}
            </p>
            <p>
              <b>Balance: </b> {balanceOfAccount} SOL
            </p>
            <br />
            <pre>
              <Button
                onClick={() => requestAirdrop(account.publicKey)}
                className={styles.btnAirdrop}>
                Airdrop
                {isLoading && (
                  <Image src={spinner} className={styles.loader} width={15} height={15} alt="" />
                )}
              </Button>
            </pre>
            <pre>
              <p>After enter recipient address, change wallet which you wanna send</p>
              <Input
                className={styles.inputAccountRecipient}
                placeholder="Account Recipient..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
              <Button className={styles.btnSend} onClick={handleSendCoin}>
                Send
              </Button>
            </pre>
            <Button
              onClick={async () => {
                await provider?.disconnect();
              }}>
              Disconnect Phantom Wallet
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default SolanaWeb3Page;
