import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { RPC_URL } from 'utils/constants/networks';

export const injected = new InjectedConnector({ supportedChainIds: [1, 4, 56] });

export const network = new NetworkConnector({
  urls: {
    1: RPC_URL[1],
    4: RPC_URL[4],
    56: RPC_URL[56],
  },
  defaultChainId: 1,
});
