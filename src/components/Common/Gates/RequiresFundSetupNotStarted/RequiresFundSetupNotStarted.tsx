import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import * as S from './RequiresFundSetupNotStarted.styles';
import { useAccountFundQuery } from '~/queries/AccountFund';

export const RequiresFundSetupNotStarted: React.FC = props => {
  const environment = useEnvironment();

  const [account, accountQuery] = useAccountFundQuery();

  if (environment && account && !account.fund) {
    return <>{props.children}</>;
  }

  return (
    <S.RequiresFundSetupNotStartedBody>
      <h1>You can only view this page if you have not yet set up your fund.</h1>
    </S.RequiresFundSetupNotStartedBody>
  );
};
