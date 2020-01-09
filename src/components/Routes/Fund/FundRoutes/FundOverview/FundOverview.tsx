import React from 'react';
import FundHoldings from './FundHoldings/FundHoldings';
import FundPolicyList from '../../FundPolicyList/FundPolicyList';
import FundFactSheet from './FundFactSheet/FundFactSheet';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';

export interface FundOverviewProps {
  address: string;
}

export const FundOverview: React.FC<FundOverviewProps> = ({ address }) => (
  <Grid>
    <GridRow>
      <GridCol xs={12} sm={12}>
        <FundFactSheet address={address} />
      </GridCol>
    </GridRow>
    <GridRow>
      <GridCol xs={12} sm={6}>
        <FundHoldings address={address} />
      </GridCol>
      <GridCol xs={12} sm={6}>
        <FundPolicyList address={address} />
      </GridCol>
    </GridRow>
  </Grid>
);

export default FundOverview;
