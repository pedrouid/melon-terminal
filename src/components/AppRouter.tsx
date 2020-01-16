import React, { Suspense } from 'react';
import ErrorBoundary from 'react-error-boundary';
import { Route, Switch } from 'react-router-dom';
import { OnChainApollo, TheGraphApollo } from './Contexts/Apollo/Apollo';
import { RequiresAccount } from './Gates/RequiresAccount/RequiresAccount';
import { RequiresConnection } from './Gates/RequiresConnection/RequiresConnection';
import { Spinner } from '../storybook/components/Spinner/Spinner';
import { ErrorFallback } from './Common/ErrorFallback/ErrorFallback';

const graphiql = JSON.parse(process.env.MELON_INCLUDE_GRAPHIQL || 'false');

const Home = React.lazy(() => import('./Routes/Home/Home'));
const Wallet = React.lazy(() => import('./Routes/Wallet/Wallet'));
const Fund = React.lazy(() => import('./Routes/Fund/Fund'));
const Playground = React.lazy(() => import('./Routes/Playground/Playground'));
const NoMatch = React.lazy(() => import('./Routes/NoMatch/NoMatch'));

export const AppRouter = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<Spinner size="large" positioning="overlay" />}>
      <Switch>
        <Route path="/" exact={true}>
          <RequiresConnection>
            <Home />
          </RequiresConnection>
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

        {graphiql && (
          <Route path="/playground/onchain" exact={true}>
            <RequiresConnection>
              <Playground context={OnChainApollo} bucket="onchain" />
            </RequiresConnection>
          </Route>
        )}

        {graphiql && (
          <Route path="/playground/thegraph" exact={true}>
            <RequiresConnection>
              <Playground context={TheGraphApollo} bucket="thegraph" />
            </RequiresConnection>
          </Route>
        )}

        <Route>
          <NoMatch />
        </Route>
      </Switch>
    </Suspense>
  </ErrorBoundary>
);
