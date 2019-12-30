import React from 'react';
import { useAccountFundQuery } from '~/queries/AccountFund';
import * as S from './RequiresNoFund.styles';

export const RequiresNoFund: React.FC = props => {
  const [account] = useAccountFundQuery();

  if (account && account.fund && account.fund.progress === 'COMPLETE') {
    return (
      <S.RequiresNoFundBody>
        <h1>You can only view this page if you have not setup your fund.</h1>
      </S.RequiresNoFundBody>
    );
  }

  return <>{props.children}</>;
};
