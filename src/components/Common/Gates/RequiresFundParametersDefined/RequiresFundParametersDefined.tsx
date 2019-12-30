import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import * as S from './RequiresFundParametersDefined.styles';
import { useAccountFundQuery } from '~/queries/AccountFund';

export const RequiresFundParametersDefined: React.FC = props => {
  const environment = useEnvironment();
  const [account] = useAccountFundQuery();

  if (environment && account && account.fund) {
    return <>{props.children}</>;
  }

  return (
    <S.RequiresFundParametersDefinedBody>
      <h1>You can only view this page if you have already defined the main parameters of your fund.</h1>
    </S.RequiresFundParametersDefinedBody>
  );
};
