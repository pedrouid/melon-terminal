import React, { useState, useEffect } from 'react';
import { ExchangeDefinition } from '@melonproject/melonjs';
import { FundOrderbook } from './FundOrderbook/FundOrderbook';
import { OrderbookItem } from './FundOrderbook/utils/aggregatedOrderbook';
import { FormField } from '~/storybook/components/FormField/FormField';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import * as S from './FundOrderbookTrading.styles';
import { FundOrderbookMarketForm } from './FundOrderbookMarketForm/FundOrderbookMarketForm';
import { FundOrderbookLimitForm } from './FundOrderbookLimitForm/FundOrderbookLimitForm';

export interface FundOrderbookTradingProps {
  address: string;
  exchanges: ExchangeDefinition[];
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

  const tokens = environment.tokens.filter(token => token !== weth);
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
    <S.FundOrderbookTrading>
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

      <S.FundOrderbookForm>
        <FormField name="asset">
          <Dropdown
            name="asset"
            options={tokenOptions}
            value={asset.address}
            onChange={event => setAsset(environment.getToken(event.target.value)!)}
          />
        </FormField>

        <FormField name="type">
          <Dropdown
            name="type"
            options={typeOptions}
            value={type}
            onChange={event => setType(event.target.value as 'limit' | 'market')}
          />
        </FormField>

        {type === 'market' && (
          <FundOrderbookMarketForm
            address={props.address}
            asset={asset}
            order={order}
            unsetOrder={() => setOrder(undefined)}
            exchanges={props.exchanges}
          />
        )}

        {type === 'limit' && (
          <FundOrderbookLimitForm
            address={props.address}
            asset={asset}
            order={order}
            unsetOrder={() => setOrder(undefined)}
            exchanges={props.exchanges}
          />
        )}
      </S.FundOrderbookForm>
    </S.FundOrderbookTrading>
  );
};
