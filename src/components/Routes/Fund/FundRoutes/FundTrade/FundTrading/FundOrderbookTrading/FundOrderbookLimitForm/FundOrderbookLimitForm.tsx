import React from 'react';
import BigNumber from 'bignumber.js';
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
  ZeroExV2TradingAdapter,
  ExchangeIdentifier,
  toBigNumber,
} from '@melonproject/melonjs';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { useAccount } from '~/hooks/useAccount';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { Button } from '~/storybook/components/Button/Button';
import { Input } from '~/storybook/components/Input/Input';
import { OrderbookItem } from '../FundOrderbook/utils/aggregatedOrderbook';
import { BlockActions } from '~/storybook/components/Block/Block';
import { NotificationBar, NotificationContent } from '~/storybook/components/NotificationBar/NotificationBar';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';

export interface FundOrderbookLimitFormProps {
  address: string;
  asset: TokenDefinition;
  exchanges: ExchangeDefinition[];
  order?: OrderbookItem;
  unsetOrder: () => void;
}

interface FundOrderbookLimitFormValues {
  quantity: string;
  price: string;
  total: string;
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

  const base = props.asset;
  const quote = environment.getToken('WETH');
  const total = props.order?.quantity.multipliedBy(props.order?.price);

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
    defaultValues: {
      direction: props.order?.side === 'bid' ? 'sell' : 'buy',
      quantity: !props.order?.quantity?.isNaN() ? props.order?.quantity.decimalPlaces(4).toString() : '',
      price: !props.order?.price?.isNaN() ? props.order?.price.decimalPlaces(4).toString() : '',
      total: !total?.isNaN() ? total?.decimalPlaces(4).toString() : '',
      exchange: props.order?.exchange ?? undefined,
    },
  });

  const submit = form.handleSubmit(async data => {
    const hub = new Hub(environment, props.address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);

    const makerAsset = data.direction === 'buy' ? quote : base;
    const takerAsset = data.direction === 'buy' ? base : quote;
    const makerQuantity = toTokenBaseUnit(data.direction === 'buy' ? data.total : data.quantity, makerAsset.decimals);
    const takerQuantity = toTokenBaseUnit(data.direction === 'buy' ? data.quantity : data.total, takerAsset.decimals);

    const exchange = environment.getExchange(data.exchange!);
    if (exchange && exchange.id === ExchangeIdentifier.OasisDex) {
      const adapter = await OasisDexTradingAdapter.create(trading, exchange.exchange);
      const tx = adapter.makeOrder(account.address!, {
        makerQuantity,
        takerQuantity,
        makerAsset: makerAsset.address,
        takerAsset: takerAsset.address,
      });

      return transaction.start(tx, 'Make order');
    }

    if (exchange && exchange.id === ExchangeIdentifier.ZeroExV2) {
      const adapter = await ZeroExV2TradingAdapter.create(trading, exchange.exchange);
      const order = await adapter.createUnsignedOrder({
        makerAssetAmount: makerQuantity,
        takerAssetAmount: takerQuantity,
        makerTokenAddress: makerAsset.address,
        takerTokenAddress: takerAsset.address,
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

  const currentDirection = form.watch('direction');
  const currentQuantity = toBigNumber(form.watch('quantity'));
  const currentPrice = toBigNumber(form.watch('price'));
  const currentTotal = toBigNumber(form.watch('total'));

  const changeQuantity = (change: BigNumber.Value) => {
    props.unsetOrder();

    const quantity = toBigNumber(change);
    const total = quantity.multipliedBy(currentPrice);
    form.setValue('total', !total.isNaN() ? total.decimalPlaces(4).toString() : '');
  }

  const changePrice = (change: BigNumber.Value) => {
    props.unsetOrder();

    const price = toBigNumber(change);
    const total = price.multipliedBy(currentQuantity);
    form.setValue('total', !total.isNaN() ? total.decimalPlaces(4).toString() : '');
  }

  const changeTotal = (change: BigNumber.Value) => {
    props.unsetOrder();

    const total = toBigNumber(change);
    const quantity = total.dividedBy(currentPrice);
    form.setValue('quantity', !quantity.isNaN() ? quantity.decimalPlaces(4).toString() : '');
  }

  const ready = !currentPrice.isNaN() && !currentQuantity.isNaN() && !currentTotal.isNaN();
  const description = ready && `Limit order: ${currentDirection === 'buy' ? 'Buy' : 'Sell'} ${currentQuantity.decimalPlaces(4).toString()} ${base.symbol} at a price of ${currentPrice.decimalPlaces(4).toString()} ${quote.symbol} per ${base.symbol} for a total of ${currentTotal.decimalPlaces(4).toString()} ${quote.symbol}`;

  return (
    <>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <Dropdown name="direction" label="Direction" options={directions} />
          <Dropdown name="exchange" label="Exchange" options={exchanges} />
          <Input type="text" name="quantity" label={`Quantity (${base.symbol})`} onChange={(event) => changeQuantity(event.target.value)} />
          <Input type="text" name="price" label={`Price (${quote.symbol} per ${base.symbol})`} onChange={(event) => changePrice(event.target.value)} />
          <Input type="text" name="total" label={`Total (${quote.symbol})`} onChange={(event) => changeTotal(event.target.value)} />

          {description && (
            <NotificationBar kind="neutral">
              <NotificationContent>
                {description}
              </NotificationContent>
            </NotificationBar>
          )}

          <BlockActions>
            <Button type="submit" disabled={!ready}>Submit</Button>
          </BlockActions>
        </form>
      </FormContext>

      <TransactionModal transaction={transaction} />
    </>
  );
};
