import React from 'react';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import FundClaimFees from './FundClaimFees/FundClaimFees';
import FundShutdown from './FundShutdown/FundShutdown';
import FundIvestmentAssets from './FundInvestmentAssets/FundInvestmentAssets';

export interface FundManagementProps {
  address: string;
}

export const FundManagement: React.FC<FundManagementProps> = ({ address }) => (
  <Grid>
    <GridRow>
      <GridCol xs={12} sm={6}>
        <FundIvestmentAssets address={address} />
      </GridCol>
      <GridCol xs={12} sm={6}>
        <FundClaimFees address={address} />
      </GridCol>
    </GridRow>
    <GridRow>
      <GridCol xs={12} sm={6}>
        <FundShutdown address={address} />
      </GridCol>
    </GridRow>
  </Grid>
);

export default FundManagement;
