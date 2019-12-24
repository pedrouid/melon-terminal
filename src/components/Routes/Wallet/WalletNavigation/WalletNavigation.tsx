import React from 'react';
import * as S from './WalletNavigation.styles';

export const WalletNavigation: React.FC = () => {
  return (
    <S.WalletNavigation>
      <S.WalletNavigationLink to="/wallet" exact={true} activeClassName="active">
        Overview
      </S.WalletNavigationLink>
      <S.WalletNavigationLink to="/wallet/weth" exact={true} activeClassName="active">
        Wrap &amp; Unwrap Ether
      </S.WalletNavigationLink>
    </S.WalletNavigation>
  );
};
