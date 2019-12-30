import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccountFundQuery } from '~/queries/AccountFund';
import * as S from './RequiresFundSetupNotStarted.styles';

export const RequiresFundSetupNotStarted: React.FC = props => {
  const environment = useEnvironment();
  const [account] = useAccountFundQuery();

  if (environment && account && !account.fund) {
    return <>{props.children}</>;
  }

  return (
    <S.RequiresFundSetupNotStartedBody>
      <h1>You can only view this page if you have not yet set up your fund.</h1>
    </S.RequiresFundSetupNotStartedBody>
  );
};
