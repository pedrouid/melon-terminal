import React from 'react';
import { Address } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { sameAddress } from '@melonproject/melonjs/utils/sameAddress';
import { useFund } from '~/hooks/useFund';

export interface RequiresFundManagerProps {
  loader?: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequiresFundManager: React.FC<RequiresFundManagerProps> = props => {
  const environment = useEnvironment()!;
  const fund = useFund();

  if (fund.loading) {
    return <>{props.loader}</>;
  }

  if (sameAddress(fund.manager, environment.account)) {
    return <>{props.children}</>;
  }

  return <>{props.fallback}</>;
};
