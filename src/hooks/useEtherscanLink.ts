import { useContext } from 'react';
import { OnChainContext } from '~/components/Contexts/Connection';

export const useEtherscanLink = (address?: string) => {
  const chain = useContext(OnChainContext);
  const network = chain && chain.environment && chain.environment.network;

  if (address && network === 'MAINNET') {
    return `https://etherscan.io/address/${address}`;
  }

  if (address && network === 'KOVAN') {
    return `https://kovan.etherscan.io/address/${address}`;
  }

  return null;
};
