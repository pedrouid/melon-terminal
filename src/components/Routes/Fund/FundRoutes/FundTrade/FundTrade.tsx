import React, { useState } from 'react';
import { TokenDefinition, ExchangeIdentifier } from '@melonproject/melonjs';
import { FundOpenOrders } from './FundOpenOrders/FundOpenOrders';
import { TabNavigation } from '~/components/Common/TabNavigation/TabNavigation';
import { TabNavigationItem } from '~/components/Common/TabNavigation/TabNavigationItem/TabNavigationItem';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { FundOrderbookTrading } from './FundOrderbookTrading/FundOrderbookTrading';
import { FundKyberTrading } from './FundKyberTrading/FundKyberTrading';
import { useFundExchanges } from './FundTrade.query';
import { Block } from '~/storybook/components/Block/Block';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import FundHoldings from '../../FundHoldings/FundHoldings';
import { FundMelonEngineTrading } from './FundMelonEngineTrading/FundMelonEngineTrading';

export interface FundTradeProps {
  address: string;
}

export const FundTrade: React.FC<FundTradeProps> = props => {
  const [exchanges, query] = useFundExchanges(props.address);

  if (query.loading) {
    return <Spinner />;
  }

  const kyber = exchanges.find(exchange => exchange.id === ExchangeIdentifier.KyberNetwork);
  const engine = exchanges.find(exchange => exchange.id === ExchangeIdentifier.MelonEngine);
  const markets = exchanges.filter(exchange => exchange.id === ExchangeIdentifier.OasisDex);
  // const markets = exchanges.filter(
  //   exchange => exchange.id === ExchangeIdentifier.OasisDex || exchange.id === ExchangeIdentifier.ZeroEx
  // );

  return (
    <Grid>
      <GridRow>
        <GridCol xs={12} sm={8}>
          <Block>
            <TabNavigation>
              {!!(markets && markets.length) && (
                <TabNavigationItem label="Orderbook" identifier="orderbook">
                  <FundOrderbookTrading address={props.address} exchanges={markets} />
                </TabNavigationItem>
              )}
              {!!kyber && (
                <TabNavigationItem label="Kyber" identifier="kyber">
                  <FundKyberTrading address={props.address} exchange={kyber} />
                </TabNavigationItem>
              )}
              {!!engine && (
                <TabNavigationItem label="Melon Engine" identifier="engine">
                  <FundMelonEngineTrading address={props.address} exchange={engine} />
                </TabNavigationItem>
              )}
            </TabNavigation>
          </Block>
        </GridCol>
        <GridCol xs={12} sm={4}>
          <FundHoldings address={props.address} />
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol xs={12} sm={12}>
          <FundOpenOrders address={props.address} />
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export default FundTrade;
