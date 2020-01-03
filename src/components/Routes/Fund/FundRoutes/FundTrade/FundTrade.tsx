import React, { useState } from 'react';
import { TokenDefinition } from '@melonproject/melonjs';
import { FundOpenOrders } from './FundOpenOrders/FundOpenOrders';
import { FundOrderbookTrading } from './FundOrderbookTrading/FundOrderbookTrading';
import FundHoldings from './FundHoldings/FundHoldings';
import * as S from './FundTrade.styles';
import { TabNavigation } from '~/components/Common/TabNavigation/TabNavigation';
import { TabNavigationItem } from '~/components/Common/TabNavigation/TabNavigationItem/TabNavigationItem';

export interface FundTradeProps {
  address: string;
}

export const FundTrade: React.FC<FundTradeProps> = props => {
  const [asset, setAsset] = useState<TokenDefinition>();

  return (
    <S.FundTradeBody>
      <S.FundTradeTop>
        <S.FundHoldings>
          <FundHoldings address={props.address} asset={asset} setAsset={setAsset} />
        </S.FundHoldings>
        <S.FundTrading>
          <TabNavigation>
            <TabNavigationItem label="Orderbook" identifier="orderbook">
              <FundOrderbookTrading address={props.address} asset={asset} />
            </TabNavigationItem>
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
