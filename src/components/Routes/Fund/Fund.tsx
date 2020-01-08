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

const NoMatch = React.lazy(() => import('~/components/Routes/NoMatch/NoMatch'));
const FundInvestRedeem = React.lazy(() => import('./FundRoutes/FundInvestRedeem/FundInvestRedeem'));
const FundDetails = React.lazy(() => import('./FundRoutes/FundDetails/FundDetails'));
const FundClaimFees = React.lazy(() => import('./FundRoutes/FundClaimFees/FundClaimFees'));
const FundRegisterPolicies = React.lazy(() => import('./FundRoutes/FundRegisterPolicies/FundRegisterPolicies'));
const FundInvestmentAssets = React.lazy(() => import('./FundRoutes/FundInvestmentAssets/FundInvestmentAssets'));
const FundShutdown = React.lazy(() => import('./FundRoutes/FundShutdown/FundShutdown'));
const FundTrade = React.lazy(() => import('./FundRoutes/FundTrade/FundTrade'));

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
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<Spinner />}>
            <Switch>
              <Route path={match.path} exact={true}>
                <FundDetails address={match.params.address} />
              </Route>
              <Route path={`${match.path}/invest`} exact={true}>
                <FundInvestRedeem address={match.params.address} />
              </Route>
              <Route path={`${match.path}/claimfees`} exact={true}>
                <FundClaimFees address={match.params.address} />
              </Route>
              <Route path={`${match.path}/policies`} exact={true}>
                <FundRegisterPolicies address={match.params.address} />
              </Route>
              <Route path={`${match.path}/trade`} exact={true}>
                <FundTrade address={match.params.address} />
              </Route>
              <Route path={`${match.path}/investmentassets`} exact={true}>
                <FundInvestmentAssets address={match.params.address} />
              </Route>
              <Route path={`${match.path}/shutdown`} exact={true}>
                <FundShutdown address={match.params.address} />
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
