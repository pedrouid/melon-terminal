import React from 'react';
import { useAccount } from '~/hooks/useAccount';

export interface RequiresAccountProps {
  fallback?: React.ReactNode;
}

export const RequiresAccount: React.FC<RequiresAccountProps> = props => {
  const account = useAccount();
  if (account && account.address) {
    return <>{props.children}</>;
  }

  return <>{props.fallback}</>;
};
