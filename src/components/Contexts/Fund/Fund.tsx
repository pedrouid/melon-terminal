import React, { createContext, useMemo } from 'react';
import { useFundContextQuery, FundContext } from './Fund.query';
import { toChecksumAddress, isAddress } from 'web3-utils';

export interface FundContextValue extends FundContext {
  loading: boolean;
  address?: string;
  exists?: boolean;
}

export interface FundProviderProps {
  address: string;
}

export const Fund = createContext<FundContextValue>({
  loading: true,
});

export const FundProvider: React.FC<FundProviderProps> = props => {
  const address = isAddress(props.address) ? toChecksumAddress(props.address) : undefined;
  const [fund, query] = useFundContextQuery({
    variables: address ? { address } : {},
    skip: !address,
  });

  const output = useMemo(() => ({ ...fund, address, exists: !!fund?.name, loading: query.loading }), [
    fund,
    query.loading,
  ]);
  return <Fund.Provider value={output}>{props.children}</Fund.Provider>;
};
