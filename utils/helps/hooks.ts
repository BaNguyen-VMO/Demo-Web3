import { Web3Provider } from '@ethersproject/providers';

type GetLibrary = (provider: any) => Web3Provider;
export const getLibrary: GetLibrary = (provider) => {
  return new Web3Provider(provider);
};

export const formatAddress = (address: string, char = 4) => {
  return `${address.substring(0, char + 2)}...${address.substring(address.length - char)}`;
};
