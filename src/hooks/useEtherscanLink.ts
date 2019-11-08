import { useEnvironment } from './useEnvironment';

export const useEtherscanLink = (address?: string) => {
  const environment = useEnvironment();
  const network = environment && environment.network;

  if (address && network === 'MAINNET') {
    return `https://etherscan.io/address/${address}`;
  }

  if (address && network === 'KOVAN') {
    return `https://kovan.etherscan.io/address/${address}`;
  }

  return null;
};
