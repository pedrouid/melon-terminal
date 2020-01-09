import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useFund } from '~/hooks/useFund';

export interface RequiresFundSetupCompleteProps {
  fallback?: React.ReactNode;
}

export const RequiresFundSetupComplete: React.FC<RequiresFundSetupCompleteProps> = ({ children, fallback = true }) => {
  const environment = useEnvironment();
  const fund = useFund();

  if (environment && fund && fund.progress && fund.progress === 'COMPLETE') {
    return <>{children}</>;
  }

  const output = fallback === true ? 'Fund setup is not completed.' : fallback;
  return <>{output || null}</>;
};
