import React, { useState } from 'react';
import { mergeDeepLeft } from 'ramda';
import { useRouteMatch, Switch, Route, useHistory, Redirect } from 'react-router';
import { SetupStepNavigation } from './SetupStepNavigation/SetupStepNavigation';
import { SetupDefineFund } from './SetupRoutes/SetupDefineFund/SetupDefineFund';
import { SetupDefineFees } from './SetupRoutes/SetupDefineFees/SetupDefineFees';
import { SetupTermsAndConditions } from './SetupRoutes/SetupDefineTermsAndConditions/SetupDefineTermsAndConditions';
import { SetupDefineOverview } from './SetupRoutes/SetupDefineOverview/SetupDefineOverview';
import { SetupTransactions } from './SetupRoutes/SetupTransactions/SetupTransactions';
import { RequiresFundSetupNotStarted } from '~/components/Common/Gates/RequiresFundSetupNotStarted/RequiresFundSetupNotStarted';
import { RequiresFundParametersDefined } from '~/components/Common/Gates/RequiresFundParametersDefined/RequiresFundParametersDefined';
import * as S from './Setup.styles';

export interface SetupDefinitionState {
  name?: string;
  exchanges?: string[];
  assets?: string[];
  managementFee?: number;
  performanceFee?: number;
  performanceFeePeriod?: number;
  termsAndConditions?: boolean;
}

export interface SetupDefinitionProps {
  state: SetupDefinitionState;
  forward: (data: SetupDefinitionState) => void;
  back: () => void;
}

export const Setup: React.FC = () => {
  const match = useRouteMatch()!;
  const history = useHistory();
  const [state, set] = useState<SetupDefinitionState>({});

  const forward = (path: string) => (data: SetupDefinitionState) => {
    set(mergeDeepLeft(state, data || {}));
    history.push(path);
  };

  const back = (path: string) => () => {
    history.push(path);
  };

  return (
    <>
      <S.SetupHeadline>Setup your fund</S.SetupHeadline>
      <S.SetupBody>
        <Switch>
          <Route path={`${match.path}/fund`} exact={true}>
            <RequiresFundSetupNotStarted>
              <SetupStepNavigation prefix={match.path} />
              <SetupDefineFund state={state} forward={forward(`${match.path}/fees`)} back={back('/wallet')} />
            </RequiresFundSetupNotStarted>
          </Route>
          <Route path={`${match.path}/fees`} exact={true}>
            <RequiresFundSetupNotStarted>
              <SetupStepNavigation prefix={match.path} />
              <SetupDefineFees
                state={state}
                forward={forward(`${match.path}/terms-and-conditions`)}
                back={back(`${match.path}/fund`)}
              />
            </RequiresFundSetupNotStarted>
          </Route>
          <Route path={`${match.path}/terms-and-conditions`} exact={true}>
            <RequiresFundSetupNotStarted>
              <SetupStepNavigation prefix={match.path} />
              <SetupTermsAndConditions
                state={state}
                forward={forward(`${match.path}/finish`)}
                back={back(`${match.path}/fees`)}
              />
            </RequiresFundSetupNotStarted>
          </Route>
          <Route path={`${match.path}/finish`} exact={true}>
            <SetupStepNavigation prefix={match.path} />
            <SetupDefineOverview state={state} back={back(`${match.path}/terms-and-conditions`)} />
          </Route>
          <Route path={`${match.path}/transactions`} exact={true}>
            <RequiresFundParametersDefined>
              <h1>Transactions for fund setup</h1>
              <SetupTransactions />
            </RequiresFundParametersDefined>
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
