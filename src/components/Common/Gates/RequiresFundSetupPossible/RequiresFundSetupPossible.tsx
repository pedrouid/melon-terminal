import React from 'react';
import { useAccount } from '~/hooks/useAccount';

export interface RequiresFundSetupPossibleProps {
  fallback?: React.ReactNode;
}

export const RequiresFundSetupPossible: React.FC<RequiresFundSetupPossibleProps> = props => {
  const account = useAccount();
  if (account && !account.fund) {
    return <>{props.children}</>;
  }

  return <>{props.fallback}</>;
};
