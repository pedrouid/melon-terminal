import React from 'react';
import { useFund } from '~/hooks/useFund';

export interface RequireFundNotShutDownProps {
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
}

export const RequiresFundNotShutDown: React.FC<RequireFundNotShutDownProps> = props => {
  const fund = useFund();

  if (fund.loading) {
    return props.loader || null;
  }

  if (fund && !fund.isShutDown) {
    return <>{props.children}</>;
  }

  return <></>;
};
