import React from 'react';
import { FundOpenOrders } from './FundOpenOrders/FundOpenOrders';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import FundHoldings from '../../FundRoutes/FundOverview/FundHoldings/FundHoldings';
import { RequiresFundNotShutDown } from '~/components/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';
import { FundTrading } from './FundTrading/FundTrading';

export interface FundTradeProps {
  address: string;
}

export const FundTrade: React.FC<FundTradeProps> = ({ address }) => {
  return (
    <Grid>
      <GridRow>
        <GridCol xs={12} sm={12}>
          <FundOpenOrders address={address} />
        </GridCol>
      </GridRow>
      <RequiresFundNotShutDown fallback={false}>
        <GridRow>
          <GridCol xs={12} sm={8}>
            <FundTrading address={address} />
          </GridCol>
          <GridCol xs={12} sm={4}>
            <FundHoldings address={address} />
          </GridCol>
        </GridRow>
      </RequiresFundNotShutDown>
    </Grid>
  );
};

export default FundTrade;
