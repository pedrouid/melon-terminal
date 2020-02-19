import React from 'react';
import { RequiresFundManager } from '~/components/Gates/RequiresFundManager/RequiresFundManager';
import { RequiresFundNotShutDown } from '~/components/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';
import { TabBar, TabBarContent, TabBarSection, TabLink } from '~/storybook/components/TabNavigation/TabNavigation';
import { RequiresFundDeployedWithCurrentVersion } from '~/components/Gates/RequiresFundDeployedWithCurrentVersion/RequiresFundDeployedWithCurrentVersion';

export interface FundNavigationProps {
  address: string;
}

export const FundNavigation: React.FC<FundNavigationProps> = ({ address }) => {
  return (
    <TabBar>
      <TabBarContent justify="between">
        <TabBarSection>
          <TabLink to={`/fund/${address}`} exact={true} activeClassName="active">
            Overview
          </TabLink>
          <TabLink to={`/fund/${address}/invest`} exact={true} activeClassName="active">
            Invest &amp; Redeem
          </TabLink>
          <TabLink to={`/fund/${address}/trade`} exact={true} activeClassName="active">
            Trade
          </TabLink>
        </TabBarSection>
        <RequiresFundManager fallback={false}>
          <TabBarSection>
            <RequiresFundDeployedWithCurrentVersion address={address} fallback={false}>
              <RequiresFundNotShutDown fallback={false}>
                <TabLink to={`/fund/${address}/policies`} exact={true} activeClassName="active">
                  Ruleset
                </TabLink>
              </RequiresFundNotShutDown>
            </RequiresFundDeployedWithCurrentVersion>
            <TabLink to={`/fund/${address}/manage`} exact={true} activeClassName="active">
              Admin
            </TabLink>
          </TabBarSection>
        </RequiresFundManager>
      </TabBarContent>
    </TabBar>
  );
};
