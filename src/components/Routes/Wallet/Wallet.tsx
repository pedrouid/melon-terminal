import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router';
import { WalletNavigation } from './WalletNavigation/WalletNavigation';
import { Container } from '~/storybook/components/Container/Container';
import { WalletHeader } from './WalletHeader/WalletHeader';
import * as S from './Wallet.styles';

const NoMatch = React.lazy(() => import('~/components/Routes/NoMatch/NoMatch'));
const WalletOverview = React.lazy(() => import('./WalletRoutes/WalletOverview/WalletOverview'));
const WalletWeth = React.lazy(() => import('./WalletRoutes/WalletWeth/WalletWeth'));
const WalletFundSetup = React.lazy(() => import('./WalletRoutes/WalletFundSetup/WalletFundSetup'));
const WalletFundSetupTransactions = React.lazy(() =>
  import('./WalletRoutes/WalletFundSetupTransactions/WalletFundSetupTransactions')
);

export const Wallet: React.FC = () => {
  const match = useRouteMatch()!;

  return (
    <>
      <WalletHeader />
      <S.WalletNavigation>
        <WalletNavigation />
      </S.WalletNavigation>
      <Container>
        <Switch>
          <Route path={match.path} exact={true}>
            <WalletOverview />
          </Route>
          <Route path={`${match.path}/weth`} exact={true}>
            <WalletWeth />
          </Route>
          <Route path={`${match.path}/setup`} exact={true}>
            <WalletFundSetup />
          </Route>
          <Route path={`${match.path}/setup/transactions`} exact={true}>
            <WalletFundSetupTransactions />
          </Route>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </Container>
    </>
  );
};

export default Wallet;
