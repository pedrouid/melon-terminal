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
import { RequiresFundJustCreated } from '~/components/Gates/RequiresFundJustCreated/RequiresFundJustCreated';
import { RequiresFundManager } from '~/components/Gates/RequiresFundManager/RequiresFundManager';
import { RequiresNoSharesCreated } from '~/components/Gates/RequiresNoSharesCreated/RequiresNoSharesCreated';
import { Link } from '~/storybook/components/Link/Link';
import { RequiresNoPoliciesDeployed } from '~/components/Gates/RequiresNoPoliciesDeployed/RequiresNoPoliciesDeployed';
import { RequiresFundDeployedWithCurrentVersion } from '~/components/Gates/RequiresFundDeployedWithCurrentVersion/RequiresFundDeployedWithCurrentVersion';
import { useConnectionState } from '~/hooks/useConnectionState';
import { networkFromName } from '~/utils/networkFromName';
import { getNetworkLabel } from '~/config';

const NoMatch = React.lazy(() => import('~/components/Routes/NoMatch/NoMatch'));
const FundSetupTransactions = React.lazy(() => import('./FundSetupTransactions/FundSetupTransactions'));
const FundDetails = React.lazy(() => import('./FundOverview/FundOverview'));
const FundInvestRedeem = React.lazy(() => import('./FundInvestRedeem/FundInvestRedeem'));
const FundTrade = React.lazy(() => import('./FundTrade/FundTrade'));
const FundPolicies = React.lazy(() => import('./FundRiskProfile/FundRiskProfile'));
const FundManagement = React.lazy(() => import('./FundManagement/FundManagement'));
const ShareFund = React.lazy(() => import('./ShareFund/ShareFund'));

export interface FundRouteParams {
  address: string;
  network: string;
}

export const Fund: React.FC = () => {
  const match = useRouteMatch<FundRouteParams>()!;

  return (
    <FundProvider address={match.params.address}>
      <FundHeader address={match.params.address} />
      <RequiresFundSetupComplete fallback={false}>
        <FundNavigation prefix={match.url} address={match.params.address} />
      </RequiresFundSetupComplete>
      <Container>
        <RequiresFundShutDown fallback={false}>
          <NotificationBar kind="error">
            <NotificationContent>This fund is shut down.</NotificationContent>
          </NotificationBar>
        </RequiresFundShutDown>
        <RequiresFundDeployedWithCurrentVersion address={match.params.address} fallback={true} />
        <RequiresFundManager fallback={false}>
          <RequiresFundDeployedWithCurrentVersion
            address={match.params.address}
            fallback={
              <NotificationBar kind="neutral">
                <NotificationContent>
                  Please <Link to={`${match.url}/manage`}>shut down your fund</Link> and{' '}
                  <Link to={`/wallet/setup`}>set up a new fund.</Link>
                </NotificationContent>
              </NotificationBar>
            }
          />
        </RequiresFundManager>
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
          <RequiresFundManager fallback={false}>
            <RequiresNoSharesCreated fallback={false} address={match.params.address}>
              <NotificationBar kind="neutral">
                <NotificationContent>
                  You have not invested into your fund yet. Go to{' '}
                  <Link to={`${match.url}/invest`}>Invest &amp; redeem</Link> to invest.
                </NotificationContent>
              </NotificationBar>
            </RequiresNoSharesCreated>
            <RequiresFundJustCreated fallback={false}>
              <RequiresNoPoliciesDeployed fallback={false} address={match.params.address}>
                <NotificationBar kind="neutral">
                  <NotificationContent>
                    You have not defined any policies for your fund. Go to{' '}
                    <Link to={`${match.url}/policies`}>Ruleset</Link> to define your policies.
                  </NotificationContent>
                </NotificationBar>
              </RequiresNoPoliciesDeployed>
              <ShareFund address={match.params.address} />
            </RequiresFundJustCreated>
          </RequiresFundManager>

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
