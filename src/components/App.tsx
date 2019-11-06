import React, { Suspense, useContext } from 'react';
import ErrorBoundary, { FallbackProps } from 'react-error-boundary';
import { ModalProvider } from 'styled-react-modal';
import { hot } from 'react-hot-loader';
import { useLocation } from 'react-router';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NetworkEnum } from '~/types';
import { ConnectionProvider, TheGraphContext, OnChainContext, OnChainContextValue } from './Contexts/Connection';
import { Spinner } from './Common/Spinner/Spinner';
import { Layout } from './Layout/Layout';
import { OfflineModal } from './Common/OfflineModal/OfflineModal';
import { method as metamask } from './Common/ConnectionSelector/MetaMask/MetaMask';
import { method as custom } from './Common/ConnectionSelector/CustomRpc/CustomRpc';
import { method as frame } from './Common/ConnectionSelector/Frame/Frame';
import { Theme, ModalBackground } from './App.styles';

const Home = React.lazy(() => import('./Routes/Home/Home'));
const Wallet = React.lazy(() => import('./Routes/Wallet/Wallet'));
const Fund = React.lazy(() => import('./Routes/Fund/Fund'));
const Connect = React.lazy(() => import('./Routes/Connect/Connect'));
const Setup = React.lazy(() => import('./Routes/Setup/Setup'));
const Playground = React.lazy(() => import('./Routes/Playground/Playground'));
const NoMatch = React.lazy(() => import('./Routes/NoMatch/NoMatch'));

function isConnected(connection: OnChainContextValue) {
  if (!connection.environment) {
    return false;
  }

  if (
    connection.environment.network === NetworkEnum.INVALID ||
    connection.environment.network === NetworkEnum.OFFLINE
  ) {
    return false;
  }

  return true;
}

const AppRouter = () => {
  const connection = useContext(OnChainContext);
  const location = useLocation();
  const modal = location.pathname !== '/connect' && !isConnected(connection);

  return (
    <>
      <OfflineModal isOpen={modal} />
      <Switch>
        <Route path="/" exact={true}>
          <Home />
        </Route>
        <Route path="/connect" exact={true}>
          <Connect />
        </Route>
        <Route path="/setup" exact={true}>
          <Setup />
        </Route>
        <Route path="/wallet">
          <Wallet />
        </Route>
        <Route path="/fund/:address">
          <Fund />
        </Route>
        <Route path="/playground/onchain" exact={true}>
          <Playground context={OnChainContext as any} bucket="onchain" />
        </Route>
        <Route path="/playground/thegraph" exact={true}>
          <Playground context={TheGraphContext} bucket="thegraph" />
        </Route>
        <Route>
          <NoMatch />
        </Route>
      </Switch>
    </>
  );
};

const AppComponent = () => (
  <Theme>
    <ModalProvider backgroundComponent={ModalBackground}>
      <ConnectionProvider methods={[metamask, frame, custom]}>
        <Router>
          <Layout>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<Spinner size="large" positioning="overlay" />}>
                <AppRouter />
              </Suspense>
            </ErrorBoundary>
          </Layout>
        </Router>
      </ConnectionProvider>
    </ModalProvider>
  </Theme>
);

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
