import React from 'react';
import NoMatch from '~/components/Routes/NoMatch/NoMatch';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import * as S from './WalletOverview.styles';
import { useAccountBalancesQuery } from '~/queries/AccountBalances';
import { useAccountFundQuery } from '~/queries/AccountFund';

export const WalletOverview: React.FC = () => {
  const [balances, query] = useAccountBalancesQuery();
  const [account, fundQuery] = useAccountFundQuery();

  if (query.loading || fundQuery.loading) {
    return (
      <S.WalletOverviewBody>
        <Spinner positioning="centered" size="large" />
      </S.WalletOverviewBody>
    );
  }

  if (!balances) {
    return <NoMatch />;
  }

  const fund = account && account.fund;

  return (
    <S.WalletOverviewBody>
      <S.WalletOverviewTitle>Balances</S.WalletOverviewTitle>
      <S.WalletOverviewBalances>
        {balances.eth && (
          <S.WalletOverviewBalance>
            <S.WalletOverviewBalanceLabel>ETH</S.WalletOverviewBalanceLabel>
            <S.WalletOverviewBalanceValue>{balances.eth.toFixed(8)}</S.WalletOverviewBalanceValue>
          </S.WalletOverviewBalance>
        )}
        {balances.weth && (
          <S.WalletOverviewBalance>
            <S.WalletOverviewBalanceLabel>WETH</S.WalletOverviewBalanceLabel>
            <S.WalletOverviewBalanceValue>{balances.weth.toFixed(8)}</S.WalletOverviewBalanceValue>
          </S.WalletOverviewBalance>
        )}
      </S.WalletOverviewBalances>
      <S.WalletOverviewTitle>Fund</S.WalletOverviewTitle>

      <S.WalletOverviewFundActions>
        {!fund && <S.WalletOverviewFundAction to="/setup">Setup your fund</S.WalletOverviewFundAction>}
        {fund && fund.progress !== 'COMPLETE' && (
          <S.WalletOverviewFundAction to="/setup/transactions">
            Continue setting up your fund
          </S.WalletOverviewFundAction>
        )}
        {fund && fund.progress === 'COMPLETE' && (
          <S.WalletOverviewFundAction to={`/fund/${fund.address}`}>Go to your fund</S.WalletOverviewFundAction>
        )}
      </S.WalletOverviewFundActions>
    </S.WalletOverviewBody>
  );
};

export default WalletOverview;
