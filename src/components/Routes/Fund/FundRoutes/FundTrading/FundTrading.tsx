import React from 'react';
import * as S from './FundTrading.styles';
import { TabNavigation } from '~/components/Common/TabNavigation/TabNavigation';
import { TabNavigationItem } from '~/components/Common/TabNavigation/TabNavigationItem/TabNavigationItem';
import { FundOrderbookTrading } from './FundOrderbookTrading/FundOrderbookTrading';
import { FundOpenOrders } from './FundOpenOrders/FundOpenOrders';
import { FundHoldings } from '../../Common/FundHoldings/FundHoldings';

export interface FundTradingProps {
  address: string;
}

export const FundTrading: React.FC<FundTradingProps> = ({ address }) => {
  return (
    <S.FundTradingBody>
      <TabNavigation>
        <TabNavigationItem label="Orderbook" identifier="orderbook">
          <FundOrderbookTrading address={address} />
        </TabNavigationItem>
        <TabNavigationItem label="Kyber" identifier="kyber">
          <div>Kyber here!</div>
        </TabNavigationItem>
        <TabNavigationItem label="Uniswap" identifier="uniswap">
          <div>Uniswap here!</div>
        </TabNavigationItem>
      </TabNavigation>
      <FundHoldings address={address} />
      <FundOpenOrders address={address} />
    </S.FundTradingBody>
  );
};

export default FundTrading;
