import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import * as S from './RequiresConnection.styles';
import { ConnectionSelector } from '../../ConnectionSelector/ConnectionSelector';

export const RequiresConnection: React.FC = props => {
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
