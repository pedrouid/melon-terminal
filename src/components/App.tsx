import React, { Suspense, useMemo } from 'react';
import ErrorBoundary, { FallbackProps } from 'react-error-boundary';
import { ModalProvider } from 'styled-react-modal';
import { hot } from 'react-hot-loader';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Spinner } from './Common/Spinner/Spinner';
import { Layout } from './Layout/Layout';
import { method as metamask } from './Common/ConnectionSelector/MetaMask/MetaMask';
import { method as frame } from './Common/ConnectionSelector/Frame/Frame';
import { method as ganache } from './Common/ConnectionSelector/Ganache/Ganache';
import { Theme, ModalBackground } from './App.styles';
import { OnChainApollo, TheGraphApollo, ApolloProvider } from './Contexts/Apollo';
import { ConnectionProvider } from './Contexts/Connection';
import { RequiresAccount } from './Common/Gates/RequiresAccount/RequiresAccount';
import { RequiresConnection } from './Common/Gates/RequiresConnection/RequiresConnection';

const Home = React.lazy(() => import('./Routes/Home/Home'));
const Wallet = React.lazy(() => import('./Routes/Wallet/Wallet'));
const Fund = React.lazy(() => import('./Routes/Fund/Fund'));
const Connect = React.lazy(() => import('./Routes/Connect/Connect'));
const Setup = React.lazy(() => import('./Routes/Setup/Setup'));
const Playground = React.lazy(() => import('./Routes/Playground/Playground'));
const NoMatch = React.lazy(() => import('./Routes/NoMatch/NoMatch'));

const AppRouter = () => {
  return (
    <>
      <Switch>
        <Route path="/" exact={true}>
          <RequiresConnection>
            <Home />
          </RequiresConnection>
        </Route>
        <Route path="/connect" exact={true}>
          <Connect />
        </Route>
        <Route path="/setup">
          <RequiresAccount>
            <Setup />
          </RequiresAccount>
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
    </>
  );
};

const AppComponent = () => {
  const methods = useMemo(() => {
    if (process.env.MELON_TESTNET) {
      return [ganache, metamask, frame];
    }

    return [metamask, frame];
  }, []);

  return (
    <Theme>
      <ModalProvider backgroundComponent={ModalBackground}>
        <ConnectionProvider methods={methods}>
          <ApolloProvider>
            <Router>
              <Layout>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Suspense fallback={<Spinner size="large" positioning="overlay" />}>
                    <AppRouter />
                  </Suspense>
                </ErrorBoundary>
              </Layout>
            </Router>
          </ApolloProvider>
        </ConnectionProvider>
      </ModalProvider>
    </Theme>
  );
};

const ErrorFallback: React.FC<FallbackProps> = ({ error, componentStack }) => (
  <div>
    <p>
      <strong>Oops! An error occured!</strong>
    </p>
    <p>Here’s what we know…</p>
    {error && (
      <p>
        <strong>Error:</strong> {error.toString()}
      </p>
    )}
    {componentStack && (
      <p>
        <strong>Stacktrace:</strong> {componentStack}
      </p>
    )}
  </div>
);

export const App = hot(module)(AppComponent);
