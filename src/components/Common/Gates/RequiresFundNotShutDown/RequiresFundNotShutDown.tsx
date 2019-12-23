import React from 'react';
import { useFund } from '~/hooks/useFund';

export interface RequiresFundNotShutDownProps {
  loader?: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequiresFundNotShutDown: React.FC<RequiresFundNotShutDownProps> = props => {
  const fund = useFund();

  if (fund.loading) {
    return <>{props.loader}</>;
  }

  if (fund.isShutDown) {
    return <>{props.children}</>;
  }

  return <>{props.fallback}</>;
};
