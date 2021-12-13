import web3 from 'web3';

export const getBalanceOf = async (address: string) => {
  const Web3 = new web3(web3.givenProvider || 'ws://remotenode.com:8546');
  const balance = await Web3.eth.getBalance(address);
  return Web3.utils.fromWei(balance, 'ether');
};
