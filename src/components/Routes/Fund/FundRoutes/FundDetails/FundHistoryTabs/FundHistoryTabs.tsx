import React from 'react';
import * as S from './FundHistoryTabs.styles';
import { FundInvestmentHistoryList } from './FundInvestmentHistoryList/FundInvestmentHistoryList';
import { FundInvestorsList } from './FundInvestorsList/FundInvestorsList';
import { TabNavigation } from '~/components/Common/TabNavigation/TabNavigation';
import { TabNavigationItem } from '~/components/Common/TabNavigation/TabNavigationItem/TabNavigationItem';

export interface FundHistoryTabsProps {
  address: string;
}

export const FundHistoryTabs: React.FC<FundHistoryTabsProps> = ({ address }) => {
  return (
    <S.Wrapper>
      <TabNavigation>
        <TabNavigationItem label="Investments and redemptions" identifier="1">
          <FundInvestmentHistoryList address={address} />
        </TabNavigationItem>
        <TabNavigationItem label="Current investors" identifier="2">
          <FundInvestorsList address={address} />
        </TabNavigationItem>
      </TabNavigation>
    </S.Wrapper>
  );
};

export default FundHistoryTabs;
