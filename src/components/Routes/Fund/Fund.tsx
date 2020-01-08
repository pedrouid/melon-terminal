import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router';
import { useFundExistsQuery } from '~/queries/FundExists';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { FundHeader } from './FundHeader/FundHeader';
import { FundNavigation } from './FundNavigation/FundNavigation';
import { FundProvider } from '~/components/Contexts/Fund/Fund';
import * as S from './Fund.styles';
import { Container } from '~/storybook/components/Container/Container';
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
  const [exists, query] = useFundExistsQuery(match.params.address);
  if (query.loading) {
    return (
      <Container>
        <Spinner positioning="centered" />
      </Container>
    );
  }

  if (!exists) {
    return (
      <Container>
        <S.FundBody>
          <h1>Fund not found</h1>
          <p>The given address {match.params.address} is invalid or is not a fund.</p>
        </S.FundBody>
      </Container>
    );
  }

  return (
    <FundProvider address={match.params.address}>
      <FundTitle />
      <FundHeader address={match.params.address} />
      <S.FundNavigation>
        <FundNavigation address={match.params.address} />
      </S.FundNavigation>
      <Container>
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
      </Container>
    </FundProvider>
  );
};

export default Fund;
