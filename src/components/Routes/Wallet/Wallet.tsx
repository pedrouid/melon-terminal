import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { WalletHeader } from './WalletHeader/WalletHeader';
import { WalletNavigation } from './WalletNavigation/WalletNavigation';
import * as S from './Wallet.styles';
import { useAccountAddressQuery } from '~/queries/AccountAddress';

const NoMatch = React.lazy(() => import('~/components/Routes/NoMatch/NoMatch'));
const WalletOverview = React.lazy(() => import('./WalletRoutes/WalletOverview/WalletOverview'));
const WalletWeth = React.lazy(() => import('./WalletRoutes/WalletWeth/WalletWeth'));

export const Wallet: React.FC = () => {
  const match = useRouteMatch()!;
  const [address, query] = useAccountAddressQuery();

  if (query.loading) {
    return <Spinner />;
  }

  if (!address) {
    return <NoMatch />;
  }

  return (
    <>
      <S.WalletHeader>
        <WalletHeader address={address} />
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
    </>
  );
};

export default Wallet;
