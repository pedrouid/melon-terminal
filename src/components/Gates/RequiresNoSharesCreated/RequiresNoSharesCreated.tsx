import React from 'react';
import { useFundDetailsQuery } from '~/queries/FundDetails';
import BigNumber from 'bignumber.js';

export interface RequiresNoSharesCreatedProps {
  address: string;
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
}

export const RequiresNoSharesCreated: React.FC<RequiresNoSharesCreatedProps> = ({
  loader,
  children,
  fallback = true,
  address,
}) => {
  const [fund, query] = useFundDetailsQuery(address);

  if (query.loading) {
    return loader || null;
  }

  const numberOfShares = fund?.routes?.shares?.totalSupply || new BigNumber(0);

  if (numberOfShares.isZero()) {
    return <>{children}</>;
  }

  const output = fallback === true ? 'The fund needs to have no shares to access this page' : fallback;
  return <>{output || null}</>;
};
