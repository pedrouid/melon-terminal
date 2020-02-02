import React, { useEffect, useRef } from 'react';
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
  ZeroExV3TradingAdapter,
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
import { Holding } from '@melonproject/melongql';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';

export interface FundOrderbookLimitFormProps {
  address: string;
  asset: TokenDefinition;
  exchanges: ExchangeDefinition[];
  holdings: Holding[];
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
  const holdings = props.holdings;
  const order = props.order;
  const total = order?.quantity.multipliedBy(order?.price ?? new BigNumber('NaN')) ?? new BigNumber('NaN');

  // TODO: These refs are used for validation. Fix this after https://github.com/react-hook-form/react-hook-form/pull/817
  const holdingsRef = useRef(holdings);
  const baseRef = useRef(base);

  const form = useForm<FundOrderbookLimitFormValues>({
    mode: 'onChange',
    validationSchema: Yup.object().shape({
      exchange: Yup.string().required(),
      direction: Yup.string()
        .required()
        .oneOf(['buy', 'sell']),
      quantity: Yup.string()
        .required('Missing quantity.')
        // tslint:disable-next-line
        .test('valid-number', 'The given value is not a valid number.', value => {
          const bn = new BigNumber(value);
          return !bn.isNaN() && bn.isPositive();
        })
        .test('balance-exceeded', 'Available balance exceeded.', value => {
          const values = form.getValues();
          if (values.direction === 'sell') {
            const holdings = holdingsRef.current;
            const asset = baseRef.current;
            const holding = holdings.find(holding => holding.token?.symbol === asset.symbol);
            const available = fromTokenBaseUnit(holding?.amount ?? new BigNumber(0), holding?.token?.decimals ?? 18);
            return available.isGreaterThanOrEqualTo(value);
          }

          return true;
        }),
      price: Yup.string()
        .required('Missing price.')
        // tslint:disable-next-line
        .test('valid-number', 'The given value is not a valid number.', value => {
          const bn = new BigNumber(value);
          return !bn.isNaN() && bn.isPositive();
        }),
      total: Yup.string()
        .required('Missing total.')
        .test('balance-exceeded', 'Available balance exceeded.', value => {
          const values = form.getValues();
          if (values.direction === 'buy') {
            const holdings = holdingsRef.current;
            const holding = holdings.find(holding => holding.token?.symbol === quote.symbol);
            const available = fromTokenBaseUnit(holding?.amount ?? new BigNumber(0), holding?.token?.decimals ?? 18);
            return available.isGreaterThanOrEqualTo(value);
          }

          return true;
        }),
    }),
    defaultValues: {
      direction: order?.side === 'bid' ? 'sell' : 'buy',
      quantity: !order?.quantity?.isNaN() ? order?.quantity.toString() : '',
      price: !order?.price?.isNaN() ? order?.price.toString() : '',
      total: !total?.isNaN() ? total?.toString() : '',
      exchange: order?.exchange ?? undefined,
    },
  });

  useEffect(() => {
    holdingsRef.current = holdings;
    baseRef.current = base;

    form.triggerValidation(['quantity', 'total']).catch(() => {});
  }, [holdings, base, form.watch('direction')]);

  const submit = form.handleSubmit(async data => {
    const hub = new Hub(environment, props.address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);

    const makerAsset = data.direction === 'buy' ? quote : base;
    const takerAsset = data.direction === 'buy' ? base : quote;
    const makerQuantity = toTokenBaseUnit(data.direction === 'buy' ? data.total : data.quantity, makerAsset.decimals);
    const takerQuantity = toTokenBaseUnit(data.direction === 'buy' ? data.quantity : data.total, takerAsset.decimals);

    const exchange = environment.getExchange(data.exchange!);
    if (exchange && exchange.id === ExchangeIdentifier.OasisDex) {
      const adapter = await OasisDexTradingAdapter.create(environment, exchange.exchange, trading);
      const tx = adapter.makeOrder(account.address!, {
        makerQuantity,
        takerQuantity,
        makerAsset: makerAsset.address,
        takerAsset: takerAsset.address,
      });

      return transaction.start(tx, 'Make order');
    }

    if (exchange && exchange.id === ExchangeIdentifier.ZeroExV2) {
      const adapter = await ZeroExV2TradingAdapter.create(environment, exchange.exchange, trading);
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

    if (exchange && exchange.id === ExchangeIdentifier.ZeroExV3) {
      const adapter = await ZeroExV3TradingAdapter.create(environment, exchange.exchange, trading);
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

    form.setValue('total', !total.isNaN() ? total.toString() : '');
    form.triggerValidation().catch(() => {});
  };

  const changePrice = (change: BigNumber.Value) => {
    props.unsetOrder();

    const price = toBigNumber(change);
    const total = price.multipliedBy(currentQuantity);

    form.setValue('total', !total.isNaN() ? total.toString() : '');
    form.triggerValidation().catch(() => {});
  };

  const changeTotal = (change: BigNumber.Value) => {
    props.unsetOrder();

    const total = toBigNumber(change);
    const quantity = total.dividedBy(currentPrice);

    form.setValue('quantity', !quantity.isNaN() ? quantity.toString() : '');
    form.triggerValidation().catch(() => {});
  };

  const ready = form.formState.isValid;
  const description = `Limit order: ${currentDirection === 'buy' ? 'Buy' : 'Sell'} ${currentQuantity
    .decimalPlaces(4)
    .toString()} ${base.symbol} at a price of ${currentPrice.decimalPlaces(4).toString()} ${quote.symbol} per ${
    base.symbol
  } for a total of ${currentTotal.decimalPlaces(4).toString()} ${quote.symbol}`;

  return (
    <>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <Dropdown name="direction" label="Direction" options={directions} />
          <Dropdown name="exchange" label="Exchange" options={exchanges} />

          <Input
            type="text"
            name="quantity"
            label={`Quantity (${base.symbol})`}
            onChange={event => changeQuantity(event.target.value)}
          />

          <Input
            type="text"
            name="price"
            label={`Price (${quote.symbol} per ${base.symbol})`}
            onChange={event => changePrice(event.target.value)}
          />

          <Input
            type="text"
            name="total"
            label={`Total (${quote.symbol})`}
            onChange={event => changeTotal(event.target.value)}
          />

          {description && (
            <NotificationBar kind="neutral">
              <NotificationContent>{description}</NotificationContent>
            </NotificationBar>
          )}

          <BlockActions>
            <Button type="submit" disabled={!ready}>
              Submit
            </Button>
          </BlockActions>
        </form>
      </FormContext>

      <TransactionModal transaction={transaction} />
    </>
  );
};
