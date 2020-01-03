import React from 'react';
import useForm, { FormContext } from 'react-hook-form';
import BigNumber from 'bignumber.js';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Trading, Hub, OasisDexTradingAdapter, TokenDefinition, ExchangeDefinition } from '@melonproject/melonjs';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { useAccount } from '~/hooks/useAccount';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { Button } from '~/storybook/components/Button/Button';

export interface FundOrderbookFormProps {
  address: string;
  asset?: TokenDefinition;
  exchanges: ExchangeDefinition[];
}

interface FundOrderbookFormValues {
  exchange: string;
  direction: 'sell' | 'buy';
  type: 'market' | 'limit';
}

export const FundOrderbookForm: React.FC<FundOrderbookFormProps> = props => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment, {
    onFinish: () => refetch(),
  });

  const form = useForm<FundOrderbookFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      type: 'limit',
      direction: 'buy',
    },
  });

  const submit = form.handleSubmit(async data => {
    const quote = environment.getToken('WETH');
    const base = props.asset!;

    const maker = data.direction === 'buy' ? quote : base;
    const taker = data.direction === 'buy' ? base : quote;
    const exchange = environment.getExchange(data.exchange);

    const hub = new Hub(environment, props.address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);

    if (exchange && exchange.name === 'OasisDex') {
      const adapter = await OasisDexTradingAdapter.create(trading, exchange.exchange);
      const tx = adapter.makeOrder(account.address!, {
        makerAsset: maker.address,
        takerAsset: taker.address,
        makerQuantity: new BigNumber(10).exponentiatedBy(maker.decimals).multipliedBy(1),
        takerQuantity: new BigNumber(10).exponentiatedBy(taker.decimals).multipliedBy(1),
      });

      transaction.start(tx, 'Make order');
    }
  });

  const exchangeOptions = props.exchanges.map(item => ({
    value: item.name,
    name: item.name,
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

  const directionOptions = [
    {
      value: 'buy',
      name: 'Buy',
    },
    {
      value: 'sell',
      name: 'Sell',
    },
  ];

  return (
    <>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <Dropdown name="exchange" options={exchangeOptions} />
          <Dropdown name="type" options={typeOptions} />
          <Dropdown name="direction" options={directionOptions} />
          <Button type="submit">Submit</Button>
        </form>
      </FormContext>
      <TransactionModal transaction={transaction} />
    </>
  );
};
