import React from 'react';
import { RequiresFundManager } from '~/components/Gates/RequiresFundManager/RequiresFundManager';
import { FundOpenOrders } from './FundOpenOrders/FundOpenOrders';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { FundHoldings } from '../../FundHoldings/FundHoldings';
import { RequiresFundNotShutDown } from '~/components/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';
import { FundTrading } from './FundTrading/FundTrading';
import { FundTradeHistory } from './FundTradeHistory/FundTradeHistory';

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
        <RequiresFundManager fallback={false}>
          <GridRow>
            <GridCol xs={12} sm={8}>
              <FundTrading address={address} />
            </GridCol>
            <GridCol xs={12} sm={4}>
              <FundHoldings address={address} />
            </GridCol>
          </GridRow>
        </RequiresFundManager>
      </RequiresFundNotShutDown>
      <GridRow>
        <GridCol xs={12} sm={12}>
          <FundTradeHistory address={address} />
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export default FundTrade;
