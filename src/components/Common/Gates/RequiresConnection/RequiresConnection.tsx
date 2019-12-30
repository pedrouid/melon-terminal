import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { ConnectionSelector } from '~/components/Common/ConnectionSelector/ConnectionSelector';
import * as S from './RequiresConnection.styles';

// TODO: Finish this.

export interface RequiresConnectionProps {
  // loader?: React.ReactElement;
  // fallback?: React.ReactNode;
}

export const RequiresConnection: React.FC<RequiresConnectionProps> = props => {
  const environment = useEnvironment();
  if (environment) {
    return <>{props.children}</>;
  }

  return (
    <S.RequiresConnectionBody>
      <h1>You have to be connected to a supported network to see this page.</h1>
      <ConnectionSelector />
    </S.RequiresConnectionBody>
  );
};
