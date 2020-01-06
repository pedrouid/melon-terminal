import React from 'react';
import { FundInvest } from './FundInvest/FundInvest';
import { FundRedeem } from './FundRedeem/FundRedeem';
import { RequiresFundNotShutDown } from '~/components/Common/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';
import { FundInvestmentHistoryList } from './FundInvestmentHistoryList/FundInvestmentHistoryList';
import { FundInvestorsList } from './FundInvestorsList/FundInvestorsList';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';

export interface FundInvestProps {
  address: string;
}

export const FundInvestRedeem: React.FC<FundInvestProps> = ({ address }) => {
  return (
    <Grid>
      <GridRow>
        <GridCol xs={12} sm={6}>
          <RequiresFundNotShutDown fallback={false}>
            <FundInvest address={address} />
          </RequiresFundNotShutDown>
        </GridCol>
        <GridCol xs={12} sm={6}>
          <FundRedeem address={address} />
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol xs={12} sm={6}>
          <FundInvestmentHistoryList address={address} />
        </GridCol>
        <GridCol xs={12} sm={6}>
          <FundInvestorsList address={address} />
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export default FundInvestRedeem;
