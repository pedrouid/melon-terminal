import React, { Suspense } from 'react';
import ErrorBoundary from 'react-error-boundary';
import { Switch, Route, useRouteMatch } from 'react-router';
import { Container } from '~/storybook/components/Container/Container';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { ErrorFallback } from '~/components/Common/ErrorFallback/ErrorFallback';
import { WalletHeader } from './WalletHeader/WalletHeader';
import { WalletNavigation } from './WalletNavigation/WalletNavigation';
import { RequiresFundSetupNotStarted } from '~/components/Gates/RequiresFundSetupNotStarted/RequiresFundSetupNotStarted';

const NoMatch = React.lazy(() => import('~/components/Routes/NoMatch/NoMatch'));
const WalletOverview = React.lazy(() => import('./WalletRoutes/WalletOverview/WalletOverview'));
const WalletWeth = React.lazy(() => import('./WalletRoutes/WalletWeth/WalletWeth'));
const WalletFundSetup = React.lazy(() => import('./WalletRoutes/WalletFundSetup/WalletFundSetup'));

export const Wallet: React.FC = () => {
  const match = useRouteMatch()!;

  return (
    <>
      <WalletHeader />
      <WalletNavigation />
      <Container>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<Spinner />}>
            <Switch>
              <Route path={match.path} exact={true}>
                <WalletOverview />
              </Route>
              <Route path={`${match.path}/weth`} exact={true}>
                <WalletWeth />
              </Route>
              <RequiresFundSetupNotStarted fallback={true}>
                <Route path={`${match.path}/setup`} exact={true}>
                  <WalletFundSetup />
                </Route>
              </RequiresFundSetupNotStarted>
              <Route>
                <NoMatch />
              </Route>
            </Switch>
          </Suspense>
        </ErrorBoundary>
      </Container>
    </>
  );
};

export default Wallet;
