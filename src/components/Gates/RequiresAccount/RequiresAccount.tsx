import React from 'react';
import { useAccount } from '~/hooks/useAccount';

export interface RequiresAccountProps {
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
}

export const RequiresAccount: React.FC<RequiresAccountProps> = ({ loader, children, fallback = true }) => {
  const account = useAccount();

  if (account.loading) {
    return loader || null;
  }

  if (account && account.address) {
    return <>{children}</>;
  }

  const output = fallback === true ? 'You have to be logged in to see this page.' : fallback;
  return <>{output || null}</>;
};
