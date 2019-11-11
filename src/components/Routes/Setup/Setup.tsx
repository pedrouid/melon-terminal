import React, { useState } from 'react';
import * as R from 'ramda';
import { useRouteMatch, Switch, Route, useHistory, Redirect } from 'react-router';
import { SetupStepNavigation } from './SetupStepNavigation/SetupStepNavigation';
import { SetupFund } from './SetupRoutes/SetupFund/SetupFund';
import { SetupFees } from './SetupRoutes/SetupFees/SetupFees';
import { SetupTermsAndConditions } from './SetupRoutes/SetupTermsAndConditions/SetupTermsAndConditions';
import { SetupStepFinish } from './SetupRoutes/SetupFinish/SetupFinish';
import * as S from './Setup.styles';

export interface SetupFundState {
  name?: string;
  exchanges?: string[];
  assets?: string[];
  managementFee?: number;
  performanceFee?: number;
  performanceFeePeriod?: number;
  termsAndConditions?: boolean;
}

export interface SetupStepsProps {
  state: SetupFundState;
  forward: (data: SetupFundState) => void;
  back: () => void;
}

export const Setup: React.FC = () => {
  const match = useRouteMatch()!;
  const history = useHistory();
  const [state, set] = useState<SetupFundState>({});

  const forward = (path: string) => (data: SetupFundState) => {
    set(R.mergeDeepLeft(state, data || {}));
    history.push(path);
  };

  const back = (path: string) => () => {
    history.push(path);
  };

  return (
    <>
      <S.SetupHeadline>Setup your Fund</S.SetupHeadline>
      <S.SetupBody>
        <SetupStepNavigation prefix={match.path} />
        <Switch>
          <Route path={`${match.path}/fund`} exact={true}>
            <SetupFund state={state} forward={forward(`${match.path}/fees`)} back={back('/wallet')} />
          </Route>
          <Route path={`${match.path}/fees`} exact={true}>
            <SetupFees
              state={state}
              forward={forward(`${match.path}/terms-and-conditions`)}
              back={back(`${match.path}/fund`)}
            />
          </Route>
          <Route path={`${match.path}/terms-and-conditions`} exact={true}>
            <SetupTermsAndConditions
              state={state}
              forward={forward(`${match.path}/finish`)}
              back={back(`${match.path}/fees`)}
            />
          </Route>
          <Route path={`${match.path}/finish`} exact={true}>
            <SetupStepFinish state={state} back={back(`${match.path}/terms-and-conditions`)} />
          </Route>
          <Route path={match.path}>
            <Redirect to={`${match.path}/fund`} />
          </Route>
        </Switch>
      </S.SetupBody>
    </>
  );
};

export default Setup;
