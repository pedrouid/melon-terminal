import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import * as S from './RequiresNoFund.styles';
import { useAccountFundQuery } from '~/queries/AccountFund';

export const RequiresNoFund: React.FC = props => {
  const [account, accountQuery] = useAccountFundQuery();

  if (account && account.fund && account.fund.progress === 'COMPLETE') {
    return (
      <S.RequiresNoFundBody>
        <h1>You can only view this page if you have not setup your fund.</h1>
      </S.RequiresNoFundBody>
    );
  }

  return <>{props.children}</>;
};
