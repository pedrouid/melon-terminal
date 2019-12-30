import React from 'react';
import { sameAddress } from '@melonproject/melonjs';
import { useAccount } from '~/hooks/useAccount';
import { useFund } from '~/hooks/useFund';

export interface RequireFundManagerProps {
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
}

export const RequiresFundManager: React.FC<RequireFundManagerProps> = props => {
  const account = useAccount();
  const fund = useFund();

  if (fund.loading || account.loading) {
    return props.loader || null;
  }

  if (account.address && sameAddress(fund.manager, account.address)) {
    return <>{props.children}</>;
  }

  return <>{props.fallback}</> || null;
};
