import React, { useState } from 'react';
import { TokenDefinition } from '@melonproject/melonjs';
import { FundOpenOrders } from './FundOpenOrders/FundOpenOrders';
import { TabNavigation } from '~/components/Common/TabNavigation/TabNavigation';
import { TabNavigationItem } from '~/components/Common/TabNavigation/TabNavigationItem/TabNavigationItem';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { FundOrderbookTrading } from './FundOrderbookTrading/FundOrderbookTrading';
import { FundKyberTrading } from './FundKyberTrading/FundKyberTrading';
import { useFundExchanges } from './FundTrade.query';
import { FundHoldings } from './FundHoldings/FundHoldings';
import * as S from './FundTrade.styles';

export interface FundTradeProps {
  address: string;
}

export const FundTrade: React.FC<FundTradeProps> = props => {
  const [asset, setAsset] = useState<TokenDefinition>();
  const [exchanges, query] = useFundExchanges(props.address);

  if (query.loading) {
    return <Spinner />;
  }

  const markets = exchanges.filter(exchange => exchange.name === 'OasisDex' || exchange.name === 'ZeroEx');
  const kyber = exchanges.filter(exchange => exchange.name === 'KyberNetwork');

  return (
    <S.FundTradeBody>
      <S.FundTradeTop>
        <S.FundHoldings>
          <FundHoldings address={props.address} asset={asset} setAsset={setAsset} />
        </S.FundHoldings>
        <S.FundTrading>
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
        </S.FundTrading>
      </S.FundTradeTop>
      <S.FundTradeBottom>
        <FundOpenOrders address={props.address} />
      </S.FundTradeBottom>
    </S.FundTradeBody>
  );
};

export default FundTrade;
