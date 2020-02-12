import React from 'react';
import { FundInvest } from './FundInvest/FundInvest';
import { FundRedeem } from './FundRedeem/FundRedeem';
import { FundInvestmentHistoryList } from './FundInvestmentHistoryList/FundInvestmentHistoryList';
import { FundInvestorsList } from './FundInvestorsList/FundInvestorsList';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { RequiresFundNotShutDown } from '~/components/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';
import { RequiresFundShutDown } from '~/components/Gates/RequiresFundShutDown/RequiresFundShutDown';

export interface FundInvestProps {
  address: string;
}

export const FundInvestRedeem: React.FC<FundInvestProps> = ({ address }) => {
  return (
    <Grid>
      <RequiresFundNotShutDown fallback={false}>
        <GridRow>
          <GridCol xs={12} sm={6}>
            <FundInvest address={address} />
          </GridCol>
          <GridCol xs={12} sm={6}>
            <FundRedeem address={address} />
          </GridCol>
        </GridRow>
      </RequiresFundNotShutDown>
      <RequiresFundShutDown fallback={false}>
        <GridRow>
          <GridCol xs={12} sm={6}>
            <FundRedeem address={address} />
          </GridCol>
          <GridCol xs={12} sm={6}>
            <FundInvestorsList address={address} />
          </GridCol>
        </GridRow>
      </RequiresFundShutDown>
      <GridRow>
        <GridCol xs={12} sm={12}>
          <FundInvestmentHistoryList address={address} />
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export default FundInvestRedeem;
