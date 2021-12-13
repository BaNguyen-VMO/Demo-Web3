type chainID = 1 | 4 | 56;
export const RPC_URL: Record<chainID, string> = {
  1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  56: 'https://bsc-dataseed.binance.org/',
};

export const NETWORKS: { [key: string]: string } = {
  1: 'Ethereum Mainnet',
  4: 'Rinkeby Test Network',
  56: 'Binance Smart Chain',
  '': '',
};
