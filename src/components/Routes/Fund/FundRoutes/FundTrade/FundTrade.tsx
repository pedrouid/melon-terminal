import React, { useState } from 'react';
import { TokenDefinition, ExchangeIdentifier } from '@melonproject/melonjs';
import { FundOpenOrders } from './FundOpenOrders/FundOpenOrders';
import { TabNavigation } from '~/components/Common/TabNavigation/TabNavigation';
import { TabNavigationItem } from '~/components/Common/TabNavigation/TabNavigationItem/TabNavigationItem';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { FundOrderbookTrading } from './FundOrderbookTrading/FundOrderbookTrading';
import { FundKyberTrading } from './FundKyberTrading/FundKyberTrading';
import { useFundExchanges } from './FundTrade.query';
import { FundHoldings } from './FundHoldings/FundHoldings';
import * as S from './FundTrade.styles';
import { Block } from '~/storybook/components/Block/Block';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';

export interface FundTradeProps {
  address: string;
}

export const FundTrade: React.FC<FundTradeProps> = props => {
  const [asset, setAsset] = useState<TokenDefinition>();
  const [exchanges, query] = useFundExchanges(props.address);

  if (query.loading) {
    return <Spinner />;
  }

  const markets = exchanges.filter(
    exchange => exchange.id === ExchangeIdentifier.OasisDex || exchange.id === ExchangeIdentifier.ZeroEx
  );
  const kyber = exchanges.filter(exchange => exchange.id === ExchangeIdentifier.KyberNetwork);

  return (
    <Grid>
      <GridRow>
        <GridCol xs={12} sm={12}>
          <Block>
            <TabNavigation>
              {!!markets && (
                <TabNavigationItem label="Orderbook" identifier="orderbook">
                  <FundOrderbookTrading address={props.address} asset={asset} exchanges={markets} />
                </TabNavigationItem>
              )}
              {!!kyber && (
                <TabNavigationItem label="Kyber" identifier="kyber">
                  <FundKyberTrading address={props.address} asset={asset} />
                </TabNavigationItem>
              )}
            </TabNavigation>
          </Block>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol xs={12} sm={6}>
          <FundHoldings address={props.address} asset={asset} setAsset={setAsset} />
        </GridCol>
        <GridCol xs={12} sm={6}>
          <FundOpenOrders address={props.address} />
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export default FundTrade;
