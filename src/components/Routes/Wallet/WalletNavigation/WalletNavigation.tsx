import React from 'react';
import * as S from './WalletNavigation.styles';
import { useAccount } from '~/hooks/useAccount';

export const WalletNavigation: React.FC = () => {
  const account = useAccount();

  return (
    <>
      <S.WalletNavigationLink to="/wallet" exact={true} activeClassName="active">
        Overview
      </S.WalletNavigationLink>
      <S.WalletNavigationLink to="/wallet/weth" exact={true} activeClassName="active">
        Wrapped Ether
      </S.WalletNavigationLink>
      {!account.fund && (
        <S.WalletNavigationLink to={`/wallet/setup`} activeClassName="active">
          Setup your fund
        </S.WalletNavigationLink>
      )}
    </>
  );
};
