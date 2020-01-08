import React, { Suspense, useLayoutEffect } from 'react';
import ErrorBoundary from 'react-error-boundary';
import { Route, Switch, useHistory } from 'react-router-dom';
import { OnChainApollo, TheGraphApollo } from './Contexts/Apollo/Apollo';
import { RequiresAccount } from './Common/Gates/RequiresAccount/RequiresAccount';
import { RequiresConnection } from './Common/Gates/RequiresConnection/RequiresConnection';
import { Spinner } from './Common/Spinner/Spinner';
import { ErrorFallback } from './Common/ErrorFallback/ErrorFallback';
import { useConnectionState } from '~/hooks/useConnectionState';

const Home = React.lazy(() => import('./Routes/Home/Home'));
const Wallet = React.lazy(() => import('./Routes/Wallet/Wallet'));
const Fund = React.lazy(() => import('./Routes/Fund/Fund'));
const Connect = React.lazy(() => import('./Routes/Connect/Connect'));
const Playground = React.lazy(() => import('./Routes/Playground/Playground'));
const NoMatch = React.lazy(() => import('./Routes/NoMatch/NoMatch'));

export const AppRouter = () => {
  const connection = useConnectionState();
  const history = useHistory();
  useLayoutEffect(() => {
    if (connection.environment?.network) {
      history.push('/');
    }
  }, [connection.environment?.network]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Spinner size="large" positioning="overlay" />}>
        <Switch>
          <Route path="/" exact={true}>
            <RequiresConnection>
              <Home />
            </RequiresConnection>
          </Route>
          <Route path="/connect" exact={true}>
            <Connect />
          </Route>
          <Route path="/wallet">
            <RequiresAccount>
              <Wallet />
            </RequiresAccount>
          </Route>
          <Route path="/fund/:address">
            <RequiresConnection>
              <Fund />
            </RequiresConnection>
          </Route>
          <Route path="/playground/onchain" exact={true}>
            <RequiresConnection>
              <Playground context={OnChainApollo} bucket="onchain" />
            </RequiresConnection>
          </Route>
          <Route path="/playground/thegraph" exact={true}>
            <RequiresConnection>
              <Playground context={TheGraphApollo} bucket="thegraph" />
            </RequiresConnection>
          </Route>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
};
