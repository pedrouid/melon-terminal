import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccountFundQuery } from '~/queries/AccountFund';

export interface RequiresFundParametersDefinedProps {
  fallback?: React.ReactNode;
}

export const RequiresFundParametersDefined: React.FC<RequiresFundParametersDefinedProps> = ({
  children,
  fallback = true,
}) => {
  const environment = useEnvironment();
  const [account] = useAccountFundQuery();

  if (environment && account && account.fund) {
    return <>{children}</>;
  }

  const output =
    fallback === true
      ? 'You can only view this page if you have already defined the main parameters of your fund.'
      : fallback;
  return <>{output || null}</>;
};
