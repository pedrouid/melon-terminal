import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import * as S from './RequiresAccount.styles';
import { ConnectionSelector } from '../../ConnectionSelector/ConnectionSelector';

export const RequiresAccount: React.FC = props => {
  const environment = useEnvironment();
  if (environment && environment.account) {
    return <>{props.children}</>;
  }

  return (
    <S.RequiresAccountBody>
      <h1>You have to be logged in to see this page.</h1>
      <ConnectionSelector />
    </S.RequiresAccountBody>
  );
};
