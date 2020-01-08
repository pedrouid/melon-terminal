import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccountFundQuery } from '~/queries/AccountFund';

export interface RequiresFundSetupCompleteProps {
  fallback?: React.ReactNode;
}

export const RequiresFundSetupComplete: React.FC<RequiresFundSetupCompleteProps> = ({ children, fallback = true }) => {
  const environment = useEnvironment();
  const [account] = useAccountFundQuery();

  if (environment && account && account.fund && account.fund.progress && account.fund.progress === 'COMPLETE') {
    return <>{children}</>;
  }

  const output = fallback === true ? 'Fund setup is not completed.' : fallback;
  return <>{output || null}</>;
};
