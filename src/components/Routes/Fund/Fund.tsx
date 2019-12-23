import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router';
import { FundContextProvider } from '~/components/Contexts/Fund/Fund';
import { RequiresFundSetupComplete } from '~/components/Common/Gates/RequiresFundSetupComplete/RequiresFundSetupComplete';
import { RequiresFundManager } from '~/components/Common/Gates/RequiresFundManager/RequiresFundManager';
import { RequiresAccount } from '~/components/Common/Gates/RequiresAccount/RequiresAccount';
import { RequiresFundExists } from '~/components/Common/Gates/RequiresFundExists/RequiresFundExists';
import { FundHeader } from './FundHeader/FundHeader';
import { FundNavigation } from './FundNavigation/FundNavigation';
import * as S from './Fund.styles';

const NoMatch = React.lazy(() => import('~/components/Routes/NoMatch/NoMatch'));
const FundInvest = React.lazy(() => import('./FundRoutes/FundInvest/FundInvest'));
const FundDetails = React.lazy(() => import('./FundRoutes/FundDetails/FundDetails'));
const FundClaimFees = React.lazy(() => import('./FundRoutes/FundClaimFees/FundClaimFees'));
const FundRegisterPolicies = React.lazy(() => import('./FundRoutes/FundRegisterPolicies/FundRegisterPolicies'));
const FundShutdown = React.lazy(() => import('./FundRoutes/FundShutdown/FundShutdown'));
const FundTrading = React.lazy(() => import('./FundRoutes/FundTrading/FundTrading'));
const FundSetup = React.lazy(() => import('./FundRoutes/FundSetup/FundSetup'));

export interface FundRouteParams {
  address: string;
}

export const Fund: React.FC = () => {
  const match = useRouteMatch<FundRouteParams>()!;

  return (
    <FundContextProvider address={match.params.address}>
      <RequiresFundExists fallback={<NoMatch />}>
        <S.FundHeader>
          <FundHeader />
        </S.FundHeader>
        <RequiresFundSetupComplete>
          <S.FundNavigation>
            <FundNavigation address={match.params.address} />
          </S.FundNavigation>
        </RequiresFundSetupComplete>
        <S.FundBody>
          <Switch>
            <Route path={match.path} exact={true}>
              <RequiresFundSetupComplete>
                <FundDetails />
              </RequiresFundSetupComplete>
            </Route>
            <Route path={`${match.path}/invest`} exact={true}>
              <RequiresAccount fallback={<Redirect to={match.path} />}>
                <RequiresFundSetupComplete fallback={<Redirect to={match.path} />}>
                  <FundInvest />
                </RequiresFundSetupComplete>
              </RequiresAccount>
            </Route>
            <Route path={`${match.path}/claimfees`} exact={true}>
              <RequiresAccount fallback={<Redirect to={match.path} />}>
                <RequiresFundSetupComplete fallback={<Redirect to={match.path} />}>
                  <FundClaimFees />
                </RequiresFundSetupComplete>
              </RequiresAccount>
            </Route>
            <Route path={`${match.path}/policies`} exact={true}>
              <RequiresFundManager>
                <RequiresFundSetupComplete fallback={<Redirect to={match.path} />}>
                  <FundRegisterPolicies address={match.params.address} />
                </RequiresFundSetupComplete>
              </RequiresFundManager>
            </Route>
            <Route path={`${match.path}/shutdown`} exact={true}>
              <RequiresFundManager>
                <RequiresFundSetupComplete fallback={<Redirect to={match.path} />}>
                  <FundShutdown address={match.params.address} />
                </RequiresFundSetupComplete>
              </RequiresFundManager>
            </Route>
            <Route path={`${match.path}/trading`} exact={true}>
              <RequiresFundManager>
                <RequiresFundSetupComplete fallback={<Redirect to={match.path} />}>
                  <FundTrading address={match.params.address} />
                </RequiresFundSetupComplete>
              </RequiresFundManager>
            </Route>
            <Route path={`${match.path}/setup`} exact={true}>
              <RequiresFundManager>
                <FundSetup />
              </RequiresFundManager>
            </Route>
            <Route>
              <NoMatch />
            </Route>
          </Switch>
        </S.FundBody>
      </RequiresFundExists>
    </FundContextProvider>
  );
};

export default Fund;
