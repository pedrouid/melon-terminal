import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccountFundQuery } from '~/queries/AccountFund';

export interface RequiresFundSetupInProgressProps {
  fallback?: React.ReactNode;
}

export const RequiresFundSetupInProgress: React.FC<RequiresFundSetupInProgressProps> = ({
  children,
  fallback = false,
}) => {
  const environment = useEnvironment();
  const [account] = useAccountFundQuery();

  if (environment && account && account.fund?.progress && account.fund?.progress !== 'COMPLETE') {
    return <>{children}</>;
  }

  return <>{fallback || null}</>;
};
