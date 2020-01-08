import React from 'react';
import * as S from './FundNavigation.styles';
import { RequiresFundManager } from '~/components/Common/Gates/RequiresFundManager/RequiresFundManager';
import { RequiresFundNotShutDown } from '~/components/Common/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';

export interface FundNavigationProps {
  address: string;
}

export const FundNavigation: React.FC<FundNavigationProps> = ({ address }) => {
  return (
    <S.FundNavigation>
      <S.FundNavigationPublic>
        <S.FundNavigationLink to={`/fund/${address}`} exact={true} activeClassName="active">
          Overview
        </S.FundNavigationLink>
        <S.FundNavigationLink to={`/fund/${address}/invest`} exact={true} activeClassName="active">
          Invest &amp; redeem
        </S.FundNavigationLink>
      </S.FundNavigationPublic>
      <RequiresFundManager fallback={false}>
        <S.FundNavigationManager>
          <RequiresFundNotShutDown fallback={false}>
            <S.FundNavigationLink to={`/fund/${address}/trade`} exact={true} activeClassName="active">
              Trade
            </S.FundNavigationLink>

            <S.FundNavigationLink to={`/fund/${address}/policies`} exact={true} activeClassName="active">
              Risk profile
            </S.FundNavigationLink>
            <S.FundNavigationLink to={`/fund/${address}/manage`} exact={true} activeClassName="active">
              Manage fund
            </S.FundNavigationLink>
          </RequiresFundNotShutDown>
        </S.FundNavigationManager>
      </RequiresFundManager>
    </S.FundNavigation>
  );
};
