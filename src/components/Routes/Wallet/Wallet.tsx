import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router';
import { WalletHeader } from './WalletHeader/WalletHeader';
import { WalletNavigation } from './WalletNavigation/WalletNavigation';
import { useAccount } from '~/hooks/useAccount';
import * as S from './Wallet.styles';

const NoMatch = React.lazy(() => import('~/components/Routes/NoMatch/NoMatch'));
const WalletOverview = React.lazy(() => import('./WalletRoutes/WalletOverview/WalletOverview'));
const WalletUnwrapEther = React.lazy(() => import('./WalletRoutes/WalletUnwrapEther/WalletUnwrapEther'));
const WalletWrapEther = React.lazy(() => import('./WalletRoutes/WalletWrapEther/WalletWrapEther'));
const WalletFundSetup = React.lazy(() => import('./WalletRoutes/WalletFundSetup/WalletFundSetup'));

export const Wallet: React.FC = () => {
  const match = useRouteMatch()!;
  const account = useAccount();

  if (!account.address) {
    return <NoMatch />;
  }

  return (
    <>
      <S.WalletHeader>
        <WalletHeader address={account.address} />
      </S.WalletHeader>
      <S.WalletNavigation>
        <WalletNavigation />
      </S.WalletNavigation>
      <S.WalletBody>
        <Switch>
          <Route path={match.path} exact={true}>
            <WalletOverview />
          </Route>
          <Route path={`${match.path}/wrap`} exact={true}>
            <WalletWrapEther />
          </Route>
          <Route path={`${match.path}/unwrap`} exact={true}>
            <WalletUnwrapEther />
          </Route>
          <Route path={`${match.path}/setup`} exact={true}>
            <WalletFundSetup />
          </Route>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </S.WalletBody>
    </>
  );
};

export default Wallet;
