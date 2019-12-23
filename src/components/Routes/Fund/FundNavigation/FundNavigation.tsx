import React from 'react';
import { RequiresFundManager } from '~/components/Common/Gates/RequiresFundManager/RequiresFundManager';
import { RequiresFundNotShutDown } from '~/components/Common/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';
import { RequiresAccount } from '~/components/Common/Gates/RequiresAccount/RequiresAccount';
import * as S from './FundNavigation.styles';

export interface FundNavigationProps {
  address: string;
}

export const FundNavigation: React.FC<FundNavigationProps> = ({ address }) => {
  return (
    <S.FundNavigation>
      <S.FundNavigationAll>
        <S.FundNavigationLink to={`/fund/${address}`} exact={true} activeClassName="active">
          Overview
        </S.FundNavigationLink>
        <RequiresAccount>
          <S.FundNavigationLink to={`/fund/${address}/invest`} exact={true} activeClassName="active">
            Invest &amp; Redeem
          </S.FundNavigationLink>
        </RequiresAccount>
      </S.FundNavigationAll>
      <RequiresFundManager>
        <S.FundNavigationManager>
          <S.FundNavigationLink to={`/fund/${address}/claimfees`} exact={true} activeClassName="active">
            Claim Fees
          </S.FundNavigationLink>
          <RequiresFundNotShutDown>
            <S.FundNavigationLink to={`/fund/${address}/trading`} exact={true} activeClassName="active">
              Trading
            </S.FundNavigationLink>
            <S.FundNavigationLink to={`/fund/${address}/policies`} exact={true} activeClassName="active">
              Add policies
            </S.FundNavigationLink>
            <S.FundNavigationLink to={`/fund/${address}/shutdown`} exact={true} activeClassName="active">
              Shut down
            </S.FundNavigationLink>
          </RequiresFundNotShutDown>
        </S.FundNavigationManager>
      </RequiresFundManager>
    </S.FundNavigation>
  );
};
