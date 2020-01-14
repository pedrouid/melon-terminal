import React, { useState } from 'react';
import { TokenDefinition, ExchangeDefinition } from '@melonproject/melonjs';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { FormField } from '~/storybook/components/FormField/FormField';
import { OrderbookItem } from '../FundOrderbook/utils/aggregatedOrderbook';
import { FundOrderbookMarketForm } from './FundOrderbookMarketForm/FundOrderbookMarketForm';
import { FundOrderbookLimitForm } from './FundOrderbookLimitForm/FundOrderbookLimitForm';

export interface FundOrderbookFormProps {
  address: string;
  exchanges: ExchangeDefinition[];
  asset?: TokenDefinition;
  order?: OrderbookItem;
  unsetOrder: () => void;
}

export const FundOrderbookForm: React.FC<FundOrderbookFormProps> = props => {
  const [type, setType] = useState<'limit' | 'market'>('limit');
  const options = [
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
    <>
      <FormField name="type">
        <Dropdown name="type" options={options} onChange={event => setType(event.target.value as 'limit' | 'market')} />
      </FormField>

      {type === 'market' && (
        <FundOrderbookMarketForm
          address={props.address}
          asset={props.asset}
          order={props.order}
          unsetOrder={props.unsetOrder}
          exchanges={props.exchanges}
        />
      )}

      {type === 'limit' && (
        <FundOrderbookLimitForm
          address={props.address}
          asset={props.asset}
          order={props.order}
          unsetOrder={props.unsetOrder}
          exchanges={props.exchanges}
        />
      )}
    </>
  );
};
