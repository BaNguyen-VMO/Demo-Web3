import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Button } from 'components';
import Link from 'next/link';
import { Paths } from 'utils/constants';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Solana-Web3 Demo</title>
      </Head>
      <div>
        <Link href={Paths.SolanaWeb3Demo} passHref>
          <Button className={styles.btnLinkSolanaPage}>Solana Web3 Demo</Button>
        </Link>
        <Link href={Paths.MetamaskDemo} passHref>
          <Button className={styles.btnLinkMetamaskPage}>Metamask Connection Demo</Button>
        </Link>
      </div>
    </>
  );
};

export default Home;
