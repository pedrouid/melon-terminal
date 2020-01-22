import React, { useEffect } from 'react';
import { useForm, FormContext } from 'react-hook-form';
import * as Yup from 'yup';
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
import { Input } from '~/storybook/components/Input/Input';
import { OrderbookItem } from '../FundOrderbook/utils/aggregatedOrderbook';
import { BlockActions } from '~/storybook/components/Block/Block';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';

export interface FundOrderbookLimitFormProps {
  address: string;
  asset?: TokenDefinition;
  exchanges: ExchangeDefinition[];
  order?: OrderbookItem;
  unsetOrder: () => void;
}

interface FundOrderbookLimitFormValues {
  quantity: string;
  price: string;
  direction: 'sell' | 'buy';
  exchange?: string;
}

export const FundOrderbookLimitForm: React.FC<FundOrderbookLimitFormProps> = props => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment, {
    onFinish: receipt => refetch(receipt.blockNumber),
  });

  const defaults: FundOrderbookLimitFormValues = {
    direction: 'buy',
    quantity: '',
    price: '',
    exchange: undefined,
  };

  const form = useForm<FundOrderbookLimitFormValues>({
    validationSchema: Yup.object().shape({
      exchange: Yup.string().required(),
      direction: Yup.string()
        .required()
        .oneOf(['buy', 'sell']),
      quantity: Yup.string().required('Missing quantity.'),
      price: Yup.string().required('Missing price.'),
    }),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: defaults,
  });

  // useEffect(() => {
  //   if (props.order) {
  //     form.setValue('direction', props.order.side === 'bid' ? 'sell' : 'buy');
  //     form.setValue('quantity', props.order.quantity.toFixed());
  //     form.setValue('price', props.order.price.toFixed());
  //   }
  // }, [props.order]);

  const submit = form.handleSubmit(async data => {
    console.log(data);
    const hub = new Hub(environment, props.address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);

    const base = props.asset!;
    const quote = environment.getToken('WETH');
    const maker = data.direction === 'buy' ? quote : base;
    const taker = data.direction === 'buy' ? base : quote;
    const exchange = environment.getExchange(data.exchange!);

    const makerQuantity = toTokenBaseUnit(data.quantity, maker.decimals).multipliedBy(data.price);
    const takerQuantity = toTokenBaseUnit(data.quantity, taker.decimals);

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
          <Dropdown name="direction" label="Direction" options={directions} />
          <Dropdown name="exchange" label="Exchange" options={exchanges} />
          <Input type="text" name="quantity" label="Quantity" onChange={() => props.order && props.unsetOrder()} />
          <Input type="text" name="price" label="Price" onChange={() => props.order && props.unsetOrder()} />

          <BlockActions>
            <Button type="submit">Submit</Button>
          </BlockActions>
        </form>
      </FormContext>

      <TransactionModal transaction={transaction} />
    </>
  );
};
