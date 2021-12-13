import { useWeb3React } from '@web3-react/core';
import { Button } from 'components';
import { useEffect, useState } from 'react';
import { NETWORKS } from 'utils/constants';
import { formatAddress, getBalanceOf, injected as ConnectorNameInjected } from 'utils/helps';

const MetamaskDemoPage = () => {
  const { activate, deactivate, account, chainId } = useWeb3React();
  const [balanceOfAccount, setBalanceOfAccount] = useState('');

  const handleConnectMetamask = () => {
    activate(ConnectorNameInjected);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        const balance = await getBalanceOf(account);
        setBalanceOfAccount(balance);
      }
    };
    fetchBalance();
  }, [account, chainId]);

  return (
    <div>
      {!account ? (
        <Button onClick={handleConnectMetamask}>Connect Wallet Metamask</Button>
      ) : (
        <>
          <pre>
            <b>Address: </b>
            <span>{formatAddress(account)}</span>
          </pre>
          <pre>
            <b>Network: </b>
            <span>{NETWORKS[chainId ?? '']}</span>
          </pre>
          <pre>
            <b>Balance: </b>
            <span>{balanceOfAccount}</span>
          </pre>
          <pre>
            <Button onClick={() => deactivate()}>Disconnect Wallet</Button>
          </pre>
        </>
      )}
    </div>
  );
};

export default MetamaskDemoPage;
