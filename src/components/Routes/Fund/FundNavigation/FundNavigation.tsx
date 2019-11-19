import React from 'react';
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
        <S.FundNavigationLink to={`/fund/${address}/invest`} exact={true} activeClassName="active">
          Invest
        </S.FundNavigationLink>
        <S.FundNavigationLink to={`/fund/${address}/redeem`} exact={true} activeClassName="active">
          Redeem
        </S.FundNavigationLink>
      </S.FundNavigationAll>
      <S.FundNavigationManager>
        <S.FundNavigationLink to={`/fund/${address}/policies`} exact={true} activeClassName="active">
          Add policies
        </S.FundNavigationLink>
        <S.FundNavigationLink to={`/fund/${address}/shutdown`} exact={true} activeClassName="active">
          Shut down
        </S.FundNavigationLink>
      </S.FundNavigationManager>
    </S.FundNavigation>
  );
};
