import React from 'react';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import FundClaimFees from './FundClaimFees/FundClaimFees';
import FundShutdown from './FundShutdown/FundShutdown';
import FundReturnBatchToVault from './FundReturnBatchToVault/FundReturnBatchToVault';
import FundIvestmentAssets from './FundInvestmentAssets/FundInvestmentAssets';
import FundExchanges from './FundExchanges/FundExchanges';
import { RequiresFundNotShutDown } from '~/components/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';
import { RequiresFundManager } from '~/components/Gates/RequiresFundManager/RequiresFundManager';

export interface FundManagementProps {
  address: string;
}

export const FundManagement: React.FC<FundManagementProps> = ({ address }) => (
  <RequiresFundManager>
    <Grid>
      <RequiresFundNotShutDown fallback={false}>
        <GridRow>
          <GridCol xs={12} sm={6}>
            <FundIvestmentAssets address={address} />
          </GridCol>
          <GridCol xs={12} sm={6}>
            <FundExchanges address={address} />
          </GridCol>
        </GridRow>
      </RequiresFundNotShutDown>
      <GridRow>
        <GridCol xs={12} sm={6}>
          <FundClaimFees address={address} />
        </GridCol>
        <RequiresFundNotShutDown fallback={false}>
          <GridCol xs={12} sm={6}>
            <FundShutdown address={address} />
          </GridCol>
        </RequiresFundNotShutDown>
      </GridRow>

      <GridRow>
        <GridCol xs={12} sm={6}>
          <FundReturnBatchToVault address={address} />
        </GridCol>
      </GridRow>
    </Grid>
  </RequiresFundManager>
);

export default FundManagement;
