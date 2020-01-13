import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccountFundQuery } from '~/queries/AccountFund';

export interface RequiresFundSetupNotStartedProps {
  fallback?: React.ReactNode;
}

export const RequiresFundSetupNotStarted: React.FC<RequiresFundSetupNotStartedProps> = ({
  children,
  fallback = true,
}) => {
  const environment = useEnvironment();
  const [account] = useAccountFundQuery();

  if (environment && account && !account.fund) {
    return <>{children}</>;
  }

  const output = fallback === true ? 'You can only view this page if you have not yet set up your fund.' : fallback;
  return <>{output || null}</>;
};
