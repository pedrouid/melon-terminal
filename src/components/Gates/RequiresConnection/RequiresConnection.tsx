import React from 'react';
import { Fallback } from '~/components/Common/Fallback/Fallback';
import { useConnectionState } from '~/hooks/useConnectionState';
import { ConnectionStatus } from '~/components/Contexts/Connection/Connection';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { NetworkEnum } from '~/types';
import { Container } from '~/storybook/components/Container/Container';

export interface RequiresConnectionProps {
  fallback?: React.ReactNode;
}

export const RequiresConnection: React.FC<RequiresConnectionProps> = ({ children, fallback = true }) => {
  const connection = useConnectionState();

  if (connection.environment) {
    return <>{children}</>;
  }

  if (connection.status === ConnectionStatus.CONNECTING) {
    return <Spinner positioning="centered" size="large" />;
  }

  if (connection.network === NetworkEnum.UNSUPPORTED) {
    const output =
      fallback === true ? (
        <Fallback>
          <Container>
            You are connected to an unsupported network. We currently only support Mainnet, Rinkeby and Kovan.
          </Container>
        </Fallback>
      ) : (
          fallback
        );

    return <>{output || null}</>;
  }

  const output =
    fallback === true ? (
      <Fallback>
        <Container>
          You have to be connected to a supported network to see this page.
        </Container>
      </Fallback>
    ) : (
        fallback
      );

  return <>{output || null}</>;
};
