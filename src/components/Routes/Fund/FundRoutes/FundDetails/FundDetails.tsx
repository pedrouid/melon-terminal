import React from 'react';
import FundHoldings from '../../FundHoldings/FundHoldings';
import FundPolicyList from '../../FundPolicyList/FundPolicyList';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';

export interface FundDetailsProps {
  address: string;
}

export const FundDetails: React.FC<FundDetailsProps> = ({ address }) => (
  <Grid>
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

export default FundDetails;
