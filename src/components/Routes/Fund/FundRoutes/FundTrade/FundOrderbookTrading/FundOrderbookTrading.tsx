import React, { useState, useEffect } from 'react';
import { ExchangeDefinition } from '@melonproject/melonjs';
import { FundOrderbook } from './FundOrderbook/FundOrderbook';
import { FundOrderbookForm } from './FundOrderbookForm/FundOrderbookForm';
import { OrderbookItem } from './FundOrderbook/utils/aggregatedOrderbook';
import { FormField } from '~/storybook/components/FormField/FormField';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import * as S from './FundOrderbookTrading.styles';

export interface FundOrderbookTradingProps {
  address: string;
  exchanges: ExchangeDefinition[];
}

export const FundOrderbookTrading: React.FC<FundOrderbookTradingProps> = props => {
  const environment = useEnvironment()!;
  const weth = environment.getToken('WETH');
  const tokens = environment.tokens.filter(token => token !== weth);
  const options = tokens.map(token => ({
    value: token.address,
    name: token.symbol,
  }));

  const [asset, setAsset] = useState(tokens[0]);
  const [order, setOrder] = useState<OrderbookItem>();
  useEffect(() => setOrder(undefined), [asset]);

  return (
    <S.FundOrderbookTrading>
      <S.FundOrderbook>
        <FundOrderbook
          address={props.address}
          asset={asset}
          exchanges={props.exchanges}
          selected={order}
          setSelected={setOrder}
        />
      </S.FundOrderbook>
      <S.FundOrderbookForm>
        <FormField label="Asset" name="asset">
          <Dropdown
            name="asset"
            options={options}
            onChange={event => setAsset(environment.getToken(event.target.value)!)}
          />
        </FormField>
        <FundOrderbookForm
          address={props.address}
          asset={asset}
          exchanges={props.exchanges}
          order={order}
          unsetOrder={() => setOrder(undefined)}
        />
      </S.FundOrderbookForm>
    </S.FundOrderbookTrading>
  );
};
