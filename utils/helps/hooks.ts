import { Web3Provider } from '@ethersproject/providers';

type GetLibrary = (provider: any) => Web3Provider;
export const getLibrary: GetLibrary = (provider) => {
  return new Web3Provider(provider);
};

export const formatAddress = (address: string, char = 4) => {
  if (address.length <= 8) return;
  return `${address.substring(0, char)}...${address.substring(address.length - char)}`;
};
