import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/SolanaWeb3Page.module.css';
import { Button } from 'components';
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import spinner from '/public/spinner.svg';

interface IAccount {
  keypair: Keypair;
}

const SolanaWeb3Page: NextPage = () => {
  const [account, setAccount] = useState<IAccount | null>(null);
  const [balanceOfAccount, setBalanceOfAccount] = useState<number | undefined>(0);
  const [isLoading, setLoading] = useState(false);

  const createConnection = () => {
    return new Connection(clusterApiUrl('devnet'));
  };

  const createAccount = async () => {
    const keypair = Keypair.generate();
    setAccount({ keypair });
    setBalanceOfAccount(0);
  };

  const getBalance = async (publicKey: PublicKey) => {
    try {
      const connection = createConnection();
      const lamports = await connection.getBalance(publicKey);
      setBalanceOfAccount(lamports / LAMPORTS_PER_SOL);

      return lamports / LAMPORTS_PER_SOL;
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (account?.keypair) {
      getBalance(account.keypair.publicKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.keypair]);

  const requestAirdrop = async (publicKey: PublicKey) => {
    setLoading(true);

    const connection = createConnection();
    const airdropSignature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature);
    const newBalance = await getBalance(publicKey);
    setBalanceOfAccount(newBalance);

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Solana-Web3 Demo</title>
      </Head>
      <div className={styles.container}>
        {!account ? (
          <Button onClick={createAccount}>Connect Wallet</Button>
        ) : (
          <div className={styles.center}>
            <p>Public key</p>
            <p>{account.keypair.publicKey.toBase58()}</p>
            <br />
            <p>Balance</p>
            <p>{balanceOfAccount} SOL</p>
            <br />
            <Button
              onClick={() => requestAirdrop(account.keypair.publicKey)}
              className={styles.btnAirdrop}>
              Airdrop
              {isLoading && (
                <Image src={spinner} className={styles.loader} width={15} height={15} alt="" />
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default SolanaWeb3Page;
