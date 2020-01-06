import React from 'react';
import FundHoldings from './FundHoldings/FundHoldings';
import FundPolicies from './FundPolicies/FundPolicies';

import { Grid, GridCol, GridRow } from '~/storybook/components/Grid/Grid';

export interface FundDetailsProps {
  address: string;
}

export const FundDetails: React.FC<FundDetailsProps> = ({ address }) => (
  <Grid>
    <GridRow>
      <GridCol>
        <FundHoldings address={address} />
      </GridCol>
    </GridRow>
    <GridRow>
      <GridCol>
        <FundPolicies address={address} />
      </GridCol>
    </GridRow>
  </Grid>
);

export default FundDetails;
