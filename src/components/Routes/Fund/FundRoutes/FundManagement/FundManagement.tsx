import React from 'react';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import FundClaimFees from './FundClaimFees/FundClaimFees';
import FundShutdown from './FundShutdown/FundShutdown';
import FundIvestmentAssets from './FundInvestmentAssets/FundInvestmentAssets';
import { RequiresFundNotShutDown } from '~/components/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';
import { RequiresFundManager } from '~/components/Gates/RequiresFundManager/RequiresFundManager';

export interface FundManagementProps {
  address: string;
}

export const FundManagement: React.FC<FundManagementProps> = ({ address }) => (
  <RequiresFundManager>
    <Grid>
      <GridRow>
        <RequiresFundNotShutDown fallback={false}>
          <GridCol xs={12} sm={6}>
            <FundIvestmentAssets address={address} />
          </GridCol>
        </RequiresFundNotShutDown>
        <GridCol xs={12} sm={6}>
          <FundClaimFees address={address} />
        </GridCol>
      </GridRow>
      <RequiresFundNotShutDown fallback={false}>
        <GridRow>
          <GridCol xs={12} sm={6}>
            <FundShutdown address={address} />
          </GridCol>
        </GridRow>
      </RequiresFundNotShutDown>
    </Grid>
  </RequiresFundManager>
);

export default FundManagement;
