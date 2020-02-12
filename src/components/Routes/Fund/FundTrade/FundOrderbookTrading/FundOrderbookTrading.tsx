import React, { useState, useEffect } from 'react';
import { ExchangeDefinition } from '@melonproject/melonjs';
import { Holding } from '@melonproject/melongql';
import { FundOrderbook } from '../FundOrderbook/FundOrderbook';
import { OrderbookItem } from '../FundOrderbook/utils/aggregatedOrderbook';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { FundOrderbookMarketForm } from '../FundOrderbookMarketForm/FundOrderbookMarketForm';
import { FundOrderbookLimitForm } from '../FundOrderbookLimitForm/FundOrderbookLimitForm';
import * as S from './FundOrderbookTrading.styles';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';

export interface FundOrderbookTradingProps {
  address: string;
  exchanges: ExchangeDefinition[];
  holdings: Holding[];
}

export const FundOrderbookTrading: React.FC<FundOrderbookTradingProps> = props => {
  const environment = useEnvironment()!;
  const weth = environment.getToken('WETH');

  const [asset, setAsset] = useState(environment.getToken('DAI'));
  const [order, setOrder] = useState<OrderbookItem>();
  const [type, setType] = useState<'limit' | 'market'>('limit');

  useEffect(() => {
    setOrder(undefined);
    setType('limit');
  }, [asset]);

  const tokens = environment.tokens.filter(token => token !== weth && !token.historic);
  const tokenOptions = tokens.map(token => ({
    value: token.address,
    name: `${token.symbol} / ${weth.symbol}`,
  }));

  const typeOptions = [
    {
      value: 'limit',
      name: 'Limit',
    },
    {
      value: 'market',
      name: 'Market',
    },
  ];

  return (
    <Block>
      <SectionTitle>Orderbook trading</SectionTitle>

      <S.FundOrderbookTrading>
        <S.FundOrderbookForm>
          <Dropdown
            name="asset"
            label="Asset pair"
            options={tokenOptions}
            value={asset.address}
            onChange={event => setAsset(environment.getToken(event.target.value)!)}
          />

          <Dropdown
            name="type"
            label="Type"
            options={typeOptions}
            value={type}
            onChange={event => setType(event.target.value as 'limit' | 'market')}
          />

          {type === 'market' && asset && (
            <FundOrderbookMarketForm
              address={props.address}
              asset={asset}
              order={order}
              unsetOrder={() => setOrder(undefined)}
              holdings={props.holdings}
              exchanges={props.exchanges}
            />
          )}

          {type === 'limit' && asset && (
            <FundOrderbookLimitForm
              address={props.address}
              asset={asset}
              order={order}
              unsetOrder={() => setOrder(undefined)}
              holdings={props.holdings}
              exchanges={props.exchanges}
            />
          )}
        </S.FundOrderbookForm>

        {asset && (
          <S.FundOrderbook>
            <FundOrderbook
              address={props.address}
              asset={asset}
              exchanges={props.exchanges}
              selected={order}
              setSelected={(order?: OrderbookItem) => {
                if (order != null && type !== 'market') {
                  setType('market');
                }

                setOrder(order);
              }}
            />
          </S.FundOrderbook>
        )}
      </S.FundOrderbookTrading>
    </Block>
  );
};
