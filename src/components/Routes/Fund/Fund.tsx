import React, { Suspense } from 'react';
import ErrorBoundary from 'react-error-boundary';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router';
import { FundProvider } from '~/components/Contexts/Fund/Fund';
import { Container } from '~/storybook/components/Container/Container';
import { ErrorFallback } from '~/components/Common/ErrorFallback/ErrorFallback';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { FundNavigation } from './FundNavigation/FundNavigation';
import { NotificationBar, NotificationContent } from '~/storybook/components/NotificationBar/NotificationBar';
import { RequiresFundShutDown } from '~/components/Gates/RequiresFundShutDown/RequiresFundShutDown';
import { RequiresFundSetupInProgress } from '~/components/Gates/RequiresFundSetupInProgress/RequiresFundSetupInProgress';
import { RequiresFundSetupComplete } from '~/components/Gates/RequiresFundSetupComplete/RequiresFundSetupComplete';
import { FundHeader } from './FundHeader/FundHeader';

const NoMatch = React.lazy(() => import('~/components/Routes/NoMatch/NoMatch'));
const FundSetupTransactions = React.lazy(() => import('./FundSetupTransactions/FundSetupTransactions'));
const FundDetails = React.lazy(() => import('./FundRoutes/FundOverview/FundOverview'));
const FundInvestRedeem = React.lazy(() => import('./FundRoutes/FundInvestRedeem/FundInvestRedeem'));
const FundTrade = React.lazy(() => import('./FundRoutes/FundTrade/FundTrade'));
const FundPolicies = React.lazy(() => import('./FundRoutes/FundRiskProfile/FundRiskProfile'));
const FundManagement = React.lazy(() => import('./FundRoutes/FundManagement/FundManagement'));

export interface FundRouteParams {
  address: string;
}

export const Fund: React.FC = () => {
  const match = useRouteMatch<FundRouteParams>()!;

  return (
    <FundProvider address={match.params.address}>
      <FundHeader address={match.params.address} />
      <RequiresFundSetupComplete fallback={false}>
        <FundNavigation address={match.params.address} />
      </RequiresFundSetupComplete>
      <Container>
        <RequiresFundShutDown fallback={false}>
          <NotificationBar kind="error">
            <NotificationContent>This fund is shut down.</NotificationContent>
          </NotificationBar>
        </RequiresFundShutDown>
        <RequiresFundSetupInProgress>
          <NotificationBar kind="neutral">
            <NotificationContent>
              You have to complete the fund setup process for this fund before you can use it.
            </NotificationContent>
          </NotificationBar>
          <Switch>
            <Route path={match.path} exact={true}>
              <FundSetupTransactions />
            </Route>
            <Route>
              <Redirect to={match.path} />
            </Route>
          </Switch>
        </RequiresFundSetupInProgress>
        <RequiresFundSetupComplete fallback={false}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Spinner />}>
              <Switch>
                <Route path={match.path} exact={true}>
                  <FundDetails address={match.params.address} />
                </Route>
                <Route path={`${match.path}/invest`} exact={true}>
                  <FundInvestRedeem address={match.params.address} />
                </Route>
                <Route path={`${match.path}/trade`} exact={true}>
                  <FundTrade address={match.params.address} />
                </Route>
                <Route path={`${match.path}/policies`} exact={true}>
                  <FundPolicies address={match.params.address} />
                </Route>
                <Route path={`${match.path}/manage`} exact={true}>
                  <FundManagement address={match.params.address} />
                </Route>
                <Route>
                  <NoMatch />
                </Route>
              </Switch>
            </Suspense>
          </ErrorBoundary>
        </RequiresFundSetupComplete>
      </Container>
    </FundProvider>
  );
};

export default Fund;
