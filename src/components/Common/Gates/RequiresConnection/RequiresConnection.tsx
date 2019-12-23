import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';

export interface RequiresConnectionProps {
  fallback?: React.ReactNode;
}

export const RequiresConnection: React.FC<RequiresConnectionProps> = props => {
  const environment = useEnvironment();
  if (environment) {
    return <>{props.children}</>;
  }

  return <>{props.fallback}</>;
};
