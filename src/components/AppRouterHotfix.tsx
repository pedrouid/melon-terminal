import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { OnChainApollo, TheGraphApollo } from './Contexts/Apollo';
import { RequiresAccount } from './Common/Gates/RequiresAccount/RequiresAccount';
import { RequiresConnection } from './Common/Gates/RequiresConnection/RequiresConnection';

const Connect = React.lazy(() => import('./Routes/Connect/Connect'));
const Playground = React.lazy(() => import('./Routes/Playground/Playground'));
const NoMatch = React.lazy(() => import('./Routes/NoMatch/NoMatch'));
const Home = React.lazy(() => import('./Routes/Hotfix/Home/Home'));
const Fund = React.lazy(() => import('./Routes/Hotfix/Fund/Fund'));

export const AppRouter = () => (
  <>
    <Switch>
      <Route path="/" exact={true}>
        <RequiresAccount>
          <Home />
        </RequiresAccount>
      </Route>
      <Route path="/connect" exact={true}>
        <Connect />
      </Route>
      <Route path="/fund/:address">
        <RequiresAccount>
          <Fund />
        </RequiresAccount>
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
