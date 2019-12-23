import React from 'react';
import { useFund } from '~/hooks/useFund';

export interface RequiresFundExistsProps {
  loader?: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequiresFundExists: React.FC<RequiresFundExistsProps> = props => {
  const fund = useFund();

  if (fund.loading) {
    return <>{props.loader}</>;
  }

  if (fund.exists) {
    return <>{props.children}</>;
  }

  return <>{props.fallback}</>;
};
