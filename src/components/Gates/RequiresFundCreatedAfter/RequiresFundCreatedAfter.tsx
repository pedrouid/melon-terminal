import React from 'react';
import { useFund } from '~/hooks/useFund';

export interface RequiresFundCreatedAfterProps {
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
  after: Date;
}

export const RequiresFundCreatedAfter: React.FC<RequiresFundCreatedAfterProps> = ({
  loader,
  children,
  fallback = true,
  after,
}) => {
  const fund = useFund();

  if (fund.loading) {
    return loader || null;
  }

  const creationTime = fund.creationTime || new Date();

  if (creationTime > after) {
    return <>{children}</>;
  }

  const output =
    fallback === true ? `The fund needs to have been created after ${after.toString()} to access this page` : fallback;
  return <>{output || null}</>;
};
