import React from 'react';
import { RequiresFundManager } from '~/components/Gates/RequiresFundManager/RequiresFundManager';
import { FundOpenOrders } from './FundOpenOrders/FundOpenOrders';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { FundHoldings } from '../../FundHoldings/FundHoldings';
import { RequiresFundNotShutDown } from '~/components/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';
import { FundTrading } from './FundTrading/FundTrading';
import { FundTradeHistory } from './FundTradeHistory/FundTradeHistory';
import { RequiresFundCreatedAfter } from '~/components/Gates/RequiresFundCreatedAfter/RequiresFundCreatedAfter';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';

export interface FundTradeProps {
  address: string;
}

export const FundTrade: React.FC<FundTradeProps> = ({ address }) => {
  const tradingNotPossible = (
    <GridRow>
      <GridCol xs={12} sm={12}>
        <Block>
          <SectionTitle>Trading</SectionTitle>
          <>Trading has been disabled for this fund.</>
        </Block>
      </GridCol>
    </GridRow>
  );

  return (
    <Grid>
      <GridRow>
        <GridCol>
          <FundOpenOrders address={address} />
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol>
          <FundTrading address={address} />
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol>
          <FundHoldings address={address} />
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol xs={12} sm={12}>
          <FundTradeHistory address={address} />
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export default FundTrade;
