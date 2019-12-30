import React from 'react';
import { sameAddress } from '@melonproject/melonjs';
import { useAccount } from '~/hooks/useAccount';
import { useFund } from '~/hooks/useFund';

export interface RequireFundManagerProps {
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
}

export const RequiresFundManager: React.FC<RequireFundManagerProps> = ({ loader, children, fallback = true }) => {
  const account = useAccount();
  const fund = useFund();

  if (fund.loading || account.loading) {
    return loader || null;
  }

  if (account.address && sameAddress(fund.manager, account.address)) {
    return <>{children}</>;
  }

  const output = fallback === true ? 'You have to be the fund manager to access this page.' : fallback;
  return <>{output || null}</>;
};
