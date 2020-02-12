import React from 'react';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { FundRegisterPolicies } from './FundRegisterPolicies/FundRegisterPolicies';
import { FundPolicies } from '../FundPolicies/FundPolicies';
import { RequiresFundDeployedWithCurrentVersion } from '~/components/Gates/RequiresFundDeployedWithCurrentVersion/RequiresFundDeployedWithCurrentVersion';

export interface FundRiskProfileProps {
  address: string;
}

export const FundRiskProfile: React.FC<FundRiskProfileProps> = ({ address }) => (
  <Grid>
    <GridRow>
      <RequiresFundDeployedWithCurrentVersion address={address} fallback={false}>
        <GridCol xs={12} sm={6}>
          <FundRegisterPolicies address={address} />
        </GridCol>
      </RequiresFundDeployedWithCurrentVersion>
      <GridCol xs={12} sm={6}>
        <FundPolicies address={address} />
      </GridCol>
    </GridRow>
  </Grid>
);

export default FundRiskProfile;
