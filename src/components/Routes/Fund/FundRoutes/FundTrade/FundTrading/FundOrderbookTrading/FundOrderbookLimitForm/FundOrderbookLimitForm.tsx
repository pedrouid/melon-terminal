import React, { useEffect } from 'react';
import useForm, { FormContext } from 'react-hook-form';
import * as Yup from 'yup';
import BigNumber from 'bignumber.js';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import {
  Trading,
  Hub,
  OasisDexTradingAdapter,
  TokenDefinition,
  ExchangeDefinition,
  ZeroExTradingAdapter,
  ExchangeIdentifier,
} from '@melonproject/melonjs';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { useAccount } from '~/hooks/useAccount';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { Button } from '~/storybook/components/Button/Button';
import { FormField } from '~/storybook/components/FormField/FormField';
import { Input } from '~/storybook/components/Input/Input';
import { OrderbookItem } from '../FundOrderbook/utils/aggregatedOrderbook';
import { BlockActions } from '~/storybook/components/Block/Block';

export interface FundOrderbookLimitFormProps {
  address: string;
  asset?: TokenDefinition;
  exchanges: ExchangeDefinition[];
  order?: OrderbookItem;
  unsetOrder: () => void;
}

interface FundOrderbookLimitFormValues {
  exchange: string;
  quantity: string;
  price: string;
  direction: 'sell' | 'buy';
}

const validationSchema = Yup.object().shape({
  exchange: Yup.string().required(),
  direction: Yup.string()
    .required()
    .oneOf(['buy', 'sell']),
  quantity: Yup.string().required(),
  price: Yup.string().required(),
});

export const FundOrderbookLimitForm: React.FC<FundOrderbookLimitFormProps> = props => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment, {
    onFinish: (receipt) => refetch(receipt.blockNumber),
  });

  const form = useForm<FundOrderbookLimitFormValues>({
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      direction: 'buy',
      quantity: '',
      price: '',
      exchange: undefined,
    },
  });

  useEffect(() => {
    if (props.order) {
      return form.reset({
        direction: props.order.side === 'bid' ? 'sell' : 'buy',
        quantity: props.order.quantity.toFixed(),
        price: props.order.price.toFixed(),
      });
    }

    form.reset();
  }, [props.order]);

  const submit = form.handleSubmit(async data => {
    const hub = new Hub(environment, props.address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);

    const base = props.asset!;
    const quote = environment.getToken('WETH');
    const maker = data.direction === 'buy' ? quote : base;
    const taker = data.direction === 'buy' ? base : quote;
    const exchange = environment.getExchange(data.exchange);

    const makerQuantity = new BigNumber(10)
      .exponentiatedBy(maker.decimals)
      .multipliedBy(new BigNumber(data.quantity).multipliedBy(data.price));
    const takerQuantity = new BigNumber(10).exponentiatedBy(taker.decimals).multipliedBy(data.quantity);

    if (exchange && exchange.id === ExchangeIdentifier.OasisDex) {
      const adapter = await OasisDexTradingAdapter.create(trading, exchange.exchange);
      const tx = adapter.makeOrder(account.address!, {
        makerQuantity,
        takerQuantity,
        makerAsset: maker.address,
        takerAsset: taker.address,
      });

      return transaction.start(tx, 'Make order');
    }

    if (exchange && exchange.id === ExchangeIdentifier.ZeroEx) {
      const adapter = await ZeroExTradingAdapter.create(trading, exchange.exchange);
      const order = await adapter.createUnsignedOrder({
        makerAssetAmount: makerQuantity,
        takerAssetAmount: takerQuantity,
        makerTokenAddress: maker.address,
        takerTokenAddress: taker.address,
      });

      const signed = await adapter.signOrder(order, account.address!);
      const tx = adapter.makeOrder(account.address!, signed);
      return transaction.start(tx, 'Make order');
    }
  });

  const exchanges = props.exchanges.map(item => ({
    value: item.id,
    name: item.name,
  }));

  const directions = [
    {
      value: 'buy',
      name: 'Buy',
    },
    {
      value: 'sell',
      name: 'Sell',
    },
  ];

  useEffect(() => {
    if (props.order?.exchange) {
      form.setValue('exchange', props.order.exchange);
    }
  }, [props.order?.exchange]);

  return (
    <>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <FormField name="direction">
            <Dropdown name="direction" options={directions} />
          </FormField>

          <FormField name="exchange">
            <Dropdown name="exchange" options={exchanges} />
          </FormField>

          <FormField label="Quantity" name="quantity">
            <Input type="text" name="quantity" onChange={() => props.order && props.unsetOrder()} />
          </FormField>

          <FormField label="Price" name="price">
            <Input type="text" name="price" onChange={() => props.order && props.unsetOrder()} />
          </FormField>
          <BlockActions>
            <Button type="submit">Submit</Button>
          </BlockActions>
        </form>
      </FormContext>

      <TransactionModal transaction={transaction} />
    </>
  );
};
