import React from 'react';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import FundRegisterPolicies from './FundRegisterPolicies/FundRegisterPolicies';
import FundPolicyList from '../../FundPolicyList/FundPolicyList';

export interface FundRiskProfileProps {
  address: string;
}

export const FundRiskProfile: React.FC<FundRiskProfileProps> = ({ address }) => (
  <Grid>
    <GridRow>
      <GridCol xs={12} sm={6}>
        <FundRegisterPolicies address={address} />
      </GridCol>
      <GridCol xs={12} sm={6}>
        <FundPolicyList address={address} />
      </GridCol>
    </GridRow>
  </Grid>
);

export default FundRiskProfile;
