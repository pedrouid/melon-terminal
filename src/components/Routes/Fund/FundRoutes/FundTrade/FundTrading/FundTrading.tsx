import React from 'react';
import { ExchangeIdentifier } from '@melonproject/melonjs';
import { TradingNavigation } from './TradingNavigation/TradingNavigation';
import { TradingNavigationItem } from './TradingNavigation/TradingNavigationItem/TradingNavigationItem';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { FundOrderbookTrading } from './FundOrderbookTrading/FundOrderbookTrading';
import { FundKyberTrading } from './FundKyberTrading/FundKyberTrading';
import { useFundTrading } from './FundTrading.query';
import { Block } from '~/storybook/components/Block/Block';
import { FundMelonEngineTrading } from './FundMelonEngineTrading/FundMelonEngineTrading';
import { useFundHoldingsQuery } from '~/queries/FundHoldings';

export interface FundTradingProps {
  address: string;
}

export const FundTrading: React.FC<FundTradingProps> = ({ address }) => {
  const [exchanges, exchangesQuery] = useFundTrading(address);
  const [holdings, holdingsQuery] = useFundHoldingsQuery(address);

  const loading = exchangesQuery.loading && holdingsQuery.loading;
  const kyber = exchanges.find(exchange => exchange.id === ExchangeIdentifier.KyberNetwork);
  const engine = exchanges.find(exchange => exchange.id === ExchangeIdentifier.MelonEngine);
  const markets = exchanges.filter(exchange => exchange.id === ExchangeIdentifier.OasisDex);

  return (
    <Block>
      {loading ? (
        <Spinner />
      ) : (
        <TradingNavigation>
          {!!(markets && markets.length) && (
            <TradingNavigationItem label="Orderbook" identifier="orderbook">
              <FundOrderbookTrading address={address} exchanges={markets} holdings={holdings} />
            </TradingNavigationItem>
          )}
          {!!kyber && (
            <TradingNavigationItem label="Kyber" identifier="kyber">
              <FundKyberTrading address={address} exchange={kyber} holdings={holdings} />
            </TradingNavigationItem>
          )}
          {!!engine && (
            <TradingNavigationItem label="Melon Engine" identifier="engine">
              <FundMelonEngineTrading address={address} exchange={engine} holdings={holdings} />
            </TradingNavigationItem>
          )}
        </TradingNavigation>
      )}
    </Block>
  );
};

export default FundTrading;
