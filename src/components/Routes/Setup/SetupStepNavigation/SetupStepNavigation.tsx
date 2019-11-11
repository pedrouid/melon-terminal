import React from 'react';
import * as S from './SetupStepNavigation.styles';

interface SetupStepNavigationProps {
  prefix: string;
}

export const SetupStepNavigation: React.FC<SetupStepNavigationProps> = props => {
  return (
    <S.SetupStepNavigationWrapper>
      <S.SetupStepNavigationList>
        <S.SetupStepNavigationItem>
          <S.SetupStepNavigationLink to={`${props.prefix}/fund`} exact={true} activeClassName="active">
            Fund
          </S.SetupStepNavigationLink>
        </S.SetupStepNavigationItem>
        <S.SetupStepNavigationItem>
          <S.SetupStepNavigationLink to={`${props.prefix}/fees`} exact={true} activeClassName="active">
            Fees
          </S.SetupStepNavigationLink>
        </S.SetupStepNavigationItem>
        <S.SetupStepNavigationItem>
          <S.SetupStepNavigationLink to={`${props.prefix}/terms-and-conditions`} exact={true} activeClassName="active">
            Terms
          </S.SetupStepNavigationLink>
        </S.SetupStepNavigationItem>
        <S.SetupStepNavigationItem>
          <S.SetupStepNavigationLink to={`${props.prefix}/finish`} exact={true} activeClassName="active">
            Overview
          </S.SetupStepNavigationLink>
        </S.SetupStepNavigationItem>
      </S.SetupStepNavigationList>
    </S.SetupStepNavigationWrapper>
  );
};
