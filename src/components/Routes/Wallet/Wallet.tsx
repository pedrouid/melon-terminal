import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router';
import { WalletHeader } from './WalletHeader/WalletHeader';
import { WalletNavigation } from './WalletNavigation/WalletNavigation';
import * as S from './Wallet.styles';

import { Container } from '~/storybook/components/Container/Container';

const NoMatch = React.lazy(() => import('~/components/Routes/NoMatch/NoMatch'));
const WalletOverview = React.lazy(() => import('./WalletRoutes/WalletOverview/WalletOverview'));
const WalletWeth = React.lazy(() => import('./WalletRoutes/WalletWeth/WalletWeth'));

export const Wallet: React.FC = () => {
  const match = useRouteMatch()!;

  return (
    <Container>
      <S.WalletHeader>
        <WalletHeader />
      </S.WalletHeader>
      <S.WalletNavigation>
        <WalletNavigation />
      </S.WalletNavigation>
      <S.WalletBody>
        <Switch>
          <Route path={match.path} exact={true}>
            <WalletOverview />
          </Route>
          <Route path={`${match.path}/weth`} exact={true}>
            <WalletWeth />
          </Route>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </S.WalletBody>
    </Container>
  );
};

export default Wallet;
