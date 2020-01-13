import React from 'react';
import { useFund } from '~/hooks/useFund';

export interface RequireFundNotShutDownProps {
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
}

export const RequiresFundNotShutDown: React.FC<RequireFundNotShutDownProps> = ({
  loader,
  children,
  fallback = true,
}) => {
  const fund = useFund();

  if (fund.loading) {
    return loader || null;
  }

  if (fund && !fund.isShutDown) {
    return <>{children}</>;
  }

  const output = fallback === true ? 'This fund is already shut down.' : fallback;
  return <>{output || null}</>;
};
