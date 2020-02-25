import React, { useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import {
  TokenDefinition,
  ExchangeDefinition,
  Trading,
  ExchangeIdentifier,
  OasisDexTradingAdapter,
  OasisDexExchange,
  toBigNumber,
  ZeroExV3TradingAdapter,
} from '@melonproject/melonjs';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { Button } from '~/storybook/components/Button/Button';
import { Input } from '~/storybook/components/Input/Input';
import { OrderbookItem } from '../FundOrderbook/utils/aggregatedOrderbook';
import { useAccount } from '~/hooks/useAccount';
import { OasisDexOrderbookItem } from '../FundOrderbook/utils/matchingMarketOrderbook';
import { useForm, FormContext } from 'react-hook-form';
import { BlockActions } from '~/storybook/components/Block/Block';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { NotificationBar, NotificationContent } from '~/storybook/components/NotificationBar/NotificationBar';
import { Holding } from '@melonproject/melongql';
import BigNumber from 'bignumber.js';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { SignedOrder } from '@0x/order-utils';

export interface FundOrderbookMarketFormProps {
  trading: string;
  asset: TokenDefinition;
  exchanges: ExchangeDefinition[];
  holdings: Holding[];
  order?: OrderbookItem;
  unsetOrder: () => void;
}

interface FundOrderbookMarketFormValues {
  quantity: string;
  total: string;
}

export const FundOrderbookMarketForm: React.FC<FundOrderbookMarketFormProps> = props => {
  const environment = useEnvironment()!;
  const account = useAccount()!;
  const transaction = useTransaction(environment, {
    onAcknowledge: () => props.unsetOrder(),
  });

  const exchanges = props.exchanges.map(item => ({
    value: item.id,
    name: item.name,
  }));

  const exchange = (props.exchanges.find(item => item.id === props.order?.exchange) ?? props.exchanges[0]).id;
  const direction = props.order?.side === 'bid' ? 'sell' : 'buy';
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

  const quote = environment.getToken('WETH');
  const base = props.asset;
  const order = props.order;
  const holdings = props.holdings;
  const price = props.order?.price ?? new BigNumber('NaN');

  // TODO: These refs are used for validation. Fix this after https://github.com/react-hook-form/react-hook-form/pull/817
  const orderRef = useRef(order);
  const holdingsRef = useRef(holdings);
  const baseRef = useRef(base);

  useEffect(() => {
    holdingsRef.current = holdings;
    orderRef.current = order;
    baseRef.current = base;

    form.triggerValidation().catch(() => {});
  }, [holdings, order, base]);

  const form = useForm<FundOrderbookMarketFormValues>({
    mode: 'onChange',
    defaultValues: {
      quantity: '',
      total: '',
    },
    validationSchema: Yup.object().shape({
      quantity: Yup.string()
        .required('Missing quantity.')
        .test('valid-number', 'The given value is not a valid number.', value => {
          const bn = new BigNumber(value);
          return !bn.isNaN() && !bn.isZero() && bn.isPositive();
        })
        .test('max-quantity', 'Maximum quantity exceeded.', value => {
          const quantity = orderRef.current?.quantity;
          return new BigNumber(value).isLessThanOrEqualTo(quantity ?? new BigNumber(0));
        })
        .test('balance-exceeded', 'Available balance exceeded.', value => {
          const order = orderRef.current;
          if (order?.side === 'bid') {
            const holdings = holdingsRef.current;
            const asset = baseRef.current;
            const holding = holdings.find(holding => holding.token?.symbol === asset.symbol);
            const available = fromTokenBaseUnit(holding?.amount ?? new BigNumber(0), holding?.token?.decimals ?? 18);
            return new BigNumber(value).isLessThanOrEqualTo(available);
          }

          return true;
        }),
      total: Yup.string()
        .required('Missing total.')
        .test('max-total', 'Maximum total exceeded.', value => {
          const total = orderRef.current?.quantity.multipliedBy(orderRef.current!.price);
          return new BigNumber(value).isLessThanOrEqualTo(total ?? new BigNumber(0));
        })
        .test('balance-exceeded', 'Available balance exceeded.', value => {
          const order = orderRef.current;
          if (order?.side === 'ask') {
            const holdings = holdingsRef.current;
            const holding = holdings.find(holding => holding.token?.symbol === quote.symbol);
            const available = fromTokenBaseUnit(holding?.amount ?? new BigNumber(0), holding?.token?.decimals ?? 18);
            return new BigNumber(value).isLessThanOrEqualTo(available);
          }

          return true;
        }),
    }),
  });

  useEffect(() => {
    const quantity = order?.quantity ?? new BigNumber('NaN');
    const total = quantity.multipliedBy(price);

    form.setValue('quantity', !quantity.isNaN() ? quantity.toString() : '');
    form.setValue('total', !total.isNaN() ? total.toString() : '');
    form.triggerValidation().catch(() => {});
  }, [order]);

  const submit = form.handleSubmit(async values => {
    const trading = new Trading(environment, props.trading);
    const exchange = environment.getExchange(order!.exchange);

    const taker = order!.side === 'bid' ? base : quote;
    const maker = order!.side === 'bid' ? quote : base;
    const quantity =
      order!.side === 'bid'
        ? toTokenBaseUnit(values.quantity, taker.decimals)
        : toTokenBaseUnit(values.total, maker.decimals);

    if (exchange.id === ExchangeIdentifier.OasisDex) {
      const market = new OasisDexExchange(environment, exchange.exchange);
      const adapter = await OasisDexTradingAdapter.create(environment, exchange.exchange, trading);
      const offer = await market.getOffer((order as OasisDexOrderbookItem).order.id);
      const tx = adapter.takeOrder(account.address!, order!.order.id, offer, quantity);
      return transaction.start(tx, 'Take order');
    }

    if (order!.exchange === ExchangeIdentifier.ZeroExV3) {
      const adapter = await ZeroExV3TradingAdapter.create(environment, exchange.exchange, trading);
      const offer = order?.order.order as SignedOrder;
      const tx = adapter.takeOrder(account.address!, offer, quantity);
      return transaction.start(tx, 'Take order');
    }
  });

  const quantity = toBigNumber(form.watch('quantity'));
  const total = toBigNumber(form.watch('total'));

  const changeQuantity = async (change: BigNumber.Value) => {
    const quantity = toBigNumber(change);
    const total = quantity.multipliedBy(price);

    form.setValue('total', !total.isNaN() ? total.toString() : '', true);
    form.triggerValidation().catch(() => {});
  };

  const changeTotal = async (change: BigNumber.Value) => {
    const total = toBigNumber(change);
    const quantity = total.dividedBy(price);

    form.setValue('quantity', !quantity.isNaN() ? quantity.toString() : '', true);
    form.triggerValidation().catch(() => {});
  };

  const ready = form.formState.isValid;
  const description =
    ready &&
    `Market order: ${direction === 'buy' ? 'Buy' : 'Sell'} ${quantity.decimalPlaces(4).toString()} ${
      base.symbol
    } at a price of ${price.decimalPlaces(4).toString()} ${quote.symbol} per ${
      base.symbol
    } for a total of ${total.decimalPlaces(4).toString()} ${quote.symbol}`;

  return (
    <FormContext {...form}>
      {order && (
        <form onSubmit={submit}>
          <Dropdown name="direction" label="Buy or sell" options={directions} disabled={true} value={direction} />
          <Dropdown name="exchange" label="Exchange" options={exchanges} disabled={true} value={exchange} />

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
            disabled={true}
            value={price.toString()}
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
            <Button type="button" length="stretch" disabled={!ready} onClick={submit}>
              Submit
            </Button>
          </BlockActions>
        </form>
      )}

      {!order && (
        <NotificationBar kind="neutral">
          <NotificationContent>Please choose an offer from the order book.</NotificationContent>
        </NotificationBar>
      )}

      <TransactionModal transaction={transaction} />
    </FormContext>
  );
};
