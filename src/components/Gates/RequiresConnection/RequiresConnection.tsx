import React from 'react';
import { Fallback } from '~/components/Common/Fallback/Fallback';
import { useConnectionState } from '~/hooks/useConnectionState';
import { ConnectionStatus } from '~/components/Contexts/Connection/Connection';
import { Loader } from '~/storybook/components/Spinner/Spinner.styles';

export interface RequiresConnectionProps {
  fallback?: React.ReactNode;
}

export const RequiresConnection: React.FC<RequiresConnectionProps> = ({ children, fallback = true }) => {
  const connection = useConnectionState();

  if (connection.environment) {
    return <>{children}</>;
  }

  if (connection.status === ConnectionStatus.CONNECTING) {
    return <Loader />;
  }

  const output =
    fallback === true ? (
      <Fallback>You have to be connected to a supported network to see this page.</Fallback>
    ) : (
      fallback
    );

  return <>{output || null}</>;
};
