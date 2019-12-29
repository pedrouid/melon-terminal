import React, { useContext } from 'react';
import { Address } from '@melonproject/melonjs';
import { Fund } from '~/components/Contexts/Fund/Fund';
import { useEnvironment } from '~/hooks/useEnvironment';

export interface RequireFundManagerProps {
  address: Address;
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
}

export const RequiresFundManager: React.FC<RequireFundManagerProps> = props => {
  const environment = useEnvironment()!;
  const fund = useContext(Fund)!;

  if (fund.loading) {
    return props.loader || null;
  }

  if (environment.account && fund.manager! === environment.account) {
    return <>{props.children}</>;
  }

  return <>{props.fallback}</> || null;
};
