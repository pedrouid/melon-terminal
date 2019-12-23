import React from 'react';
import { useFund } from '~/hooks/useFund';

export interface RequiresFundSetupCompleteProps {
  loader?: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequiresFundSetupComplete: React.FC<RequiresFundSetupCompleteProps> = props => {
  const fund = useFund();

  if (fund.loading) {
    return <>{props.loader}</>;
  }

  if (fund.progress === 'COMPLETE') {
    return <>{props.children}</>;
  }

  return <>{props.fallback}</>;
};
