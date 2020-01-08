import React, { Suspense } from 'react';
import ErrorBoundary from 'react-error-boundary';
import { Switch, Route, useRouteMatch } from 'react-router';
import { FundProvider } from '~/components/Contexts/Fund/Fund';
import { Container } from '~/storybook/components/Container/Container';
import { ErrorFallback } from '~/components/Common/ErrorFallback/ErrorFallback';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { FundHeader } from './FundHeader/FundHeader';
import { FundNavigation } from './FundNavigation/FundNavigation';
import { FundTitle } from './FundTitle/FundTitle';
import { NotificationBar, NotificationContent } from '~/storybook/components/NotificationBar/NotificationBar';
import { RequiresFundShutDown } from '~/components/Common/Gates/RequiresFundShutDown/RequiresFundShutDown';

const NoMatch = React.lazy(() => import('~/components/Routes/NoMatch/NoMatch'));
const FundDetails = React.lazy(() => import('./FundRoutes/FundDetails/FundDetails'));
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
      <FundTitle />
      <FundHeader address={match.params.address} />
      <FundNavigation address={match.params.address} />
      <Container>
        <RequiresFundShutDown fallback={false}>
          <NotificationBar kind="error">
            <NotificationContent>This fund is already shut down.</NotificationContent>
          </NotificationBar>
        </RequiresFundShutDown>
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
      </Container>
    </FundProvider>
  );
};

export default Fund;
