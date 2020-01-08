import React from 'react';
import { RequiresFundManager } from '~/components/Common/Gates/RequiresFundManager/RequiresFundManager';
import { RequiresFundNotShutDown } from '~/components/Common/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';
import { TabBar, TabBarContent, TabBarSection, TabLink } from '~/storybook/components/TabNavigation/TabNavigation';

export interface FundNavigationProps {
  address: string;
}

export const FundNavigation: React.FC<FundNavigationProps> = ({ address }) => {
  return (
    <TabBar>
      <TabBarContent justify='between'>
        <TabBarSection>
          <TabLink to={`/fund/${address}`} exact={true} activeClassName="active">
            Overview
          </TabLink>
          <TabLink to={`/fund/${address}/invest`} exact={true} activeClassName="active">
            Invest &amp; redeem
          </TabLink>
        </TabBarSection>
        <RequiresFundManager fallback={false}>
          <RequiresFundNotShutDown fallback={false}>
            <TabBarSection>
              <TabLink to={`/fund/${address}/trade`} exact={true} activeClassName="active">
                Trade
                </TabLink>
              <TabLink to={`/fund/${address}/policies`} exact={true} activeClassName="active">
                Ruleset
                </TabLink>
              <TabLink to={`/fund/${address}/manage`} exact={true} activeClassName="active">
                Manage
                </TabLink>
            </TabBarSection>
          </RequiresFundNotShutDown>
        </RequiresFundManager>
      </TabBarContent>
    </TabBar>
  );
};
