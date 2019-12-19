import React, { createContext } from 'react';
import { useFundContextQuery } from '~/queries/FundContext';

export interface FundContextValue {
  loading: boolean;
  address?: string;
  shutdown?: string;
  manager?: string;
}

export interface FundContextProviderProps {
  address: string;
}

export const FundContext = createContext<FundContextValue>({
  loading: true,
});

export const FundContextProvider: React.FC<FundContextProviderProps> = ({ address, children }) => {
  const [fund, query] = useFundContextQuery(address);

  return <FundContext.Provider value={{ ...fund, loading: query.loading }}>{children}</FundContext.Provider>;
};
