import React from 'react';
import { useAccount } from '~/hooks/useAccount';
import * as S from './WalletOverview.styles';

export const WalletOverview: React.FC = () => {
  const account = useAccount();

  return (
    <S.WalletOverviewBody>
      <S.WalletOverviewTitle>Balances</S.WalletOverviewTitle>
      <S.WalletOverviewBalances>
        <S.WalletOverviewBalance>
          <S.WalletOverviewBalanceLabel>ETH</S.WalletOverviewBalanceLabel>
          <S.WalletOverviewBalanceValue>{account.eth?.toFixed(8) ?? 'N/A'}</S.WalletOverviewBalanceValue>
        </S.WalletOverviewBalance>
        <S.WalletOverviewBalance>
          <S.WalletOverviewBalanceLabel>WETH</S.WalletOverviewBalanceLabel>
          <S.WalletOverviewBalanceValue>{account.weth?.toFixed(8) ?? 'N/A'}</S.WalletOverviewBalanceValue>
        </S.WalletOverviewBalance>
      </S.WalletOverviewBalances>
    </S.WalletOverviewBody>
  );
};

export default WalletOverview;
