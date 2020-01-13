import React from 'react';
import { ExchangeIdentifier } from '@melonproject/melonjs';
import { TradingNavigation } from './TradingNavigation/TradingNavigation';
import { TradingNavigationItem } from './TradingNavigation/TradingNavigationItem/TradingNavigationItem';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { FundOrderbookTrading } from '../FundOrderbookTrading/FundOrderbookTrading';
import { FundKyberTrading } from '../FundKyberTrading/FundKyberTrading';
import { useFundTrading } from './FundTrading.query';
import { Block } from '~/storybook/components/Block/Block';
import { FundMelonEngineTrading } from '../FundMelonEngineTrading/FundMelonEngineTrading';

export interface FundTradingProps {
  address: string;
}

export const FundTrading: React.FC<FundTradingProps> = ({ address }) => {
  const [exchanges, query] = useFundTrading(address);
  const kyber = exchanges.find(exchange => exchange.id === ExchangeIdentifier.KyberNetwork);
  const engine = exchanges.find(exchange => exchange.id === ExchangeIdentifier.MelonEngine);
  const markets = exchanges.filter(exchange => exchange.id === ExchangeIdentifier.OasisDex);

  return (
    <Block>
      {query.loading && <Spinner />}

      {!query.loading && (
        <TradingNavigation>
          {!!(markets && markets.length) && (
            <TradingNavigationItem label="Orderbook" identifier="orderbook">
              <FundOrderbookTrading address={address} exchanges={markets} />
            </TradingNavigationItem>
          )}
          {!!kyber && (
            <TradingNavigationItem label="Kyber" identifier="kyber">
              <FundKyberTrading address={address} exchange={kyber} />
            </TradingNavigationItem>
          )}
          {!!engine && (
            <TradingNavigationItem label="Melon Engine" identifier="engine">
              <FundMelonEngineTrading address={address} exchange={engine} />
            </TradingNavigationItem>
          )}
        </TradingNavigation>
      )}
    </Block>
  );
};

export default FundTrading;
