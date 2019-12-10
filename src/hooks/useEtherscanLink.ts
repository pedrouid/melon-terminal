import { useMemo } from 'react';
import { useEnvironment } from './useEnvironment';

export interface UseEtherscanLinkProps {
  address?: string;
  hash?: string;
}

export const useEtherscanLink = ({ address, hash }: UseEtherscanLinkProps) => {
  const environment = useEnvironment();
  const network = environment && environment.network;

  const url = useMemo(() => {
    if (!address && !hash) return null;

    const link = address ? `address/${address}` : `tx/${hash}`;

    if (network === 'MAINNET') {
      return `https://etherscan.io/${link}`;
    }

    if (network === 'KOVAN') {
      return `https://kovan.etherscan.io/${link}`;
    }

    return `https://etherscan.io/${link}`;
  }, [address, hash]);

  return url;
};
