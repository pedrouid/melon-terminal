import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';

export interface RequiresConnectionProps {
  fallback?: React.ReactNode;
}

export const RequiresConnection: React.FC<RequiresConnectionProps> = ({ children, fallback = true }) => {
  const environment = useEnvironment();

  if (environment) {
    return <>{children}</>;
  }

  const output = fallback === true ? 'You have to be connected to a supported network to see this page.' : fallback;
  return <>{output || null}</>;
};
