import React, { useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import {
  TokenDefinition,
  ExchangeDefinition,
  Hub,
  Trading,
  ExchangeIdentifier,
  OasisDexTradingAdapter,
  OasisDexExchange,
  ZeroExV2TradingAdapter,
  toBigNumber,
} from '@melonproject/melonjs';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
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
import BigNumber from 'bignumber.js';

export interface FundOrderbookMarketFormProps {
  address: string;
  asset: TokenDefinition;
  exchanges: ExchangeDefinition[];
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
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment, {
    onFinish: receipt => {
      props.unsetOrder();
      return refetch(receipt.blockNumber);
    },
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

  const form = useForm<FundOrderbookMarketFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      quantity: '',
      total: '',
    },
    validationSchema: Yup.object().shape({
      quantity: Yup.string()
        .required(),
      // .test('max', 'Maximum quantity exceeded', value => {
      //   if (!quantityRef.current) {
      //     return false;
      //   }

      //   return quantityRef.current!.isGreaterThanOrEqualTo(value);
      // }),
      total: Yup.string()
        .required(),
      // .test('max', 'Maximum quantity exceeded', value => {
      //   if (!quantityRef.current) {
      //     return false;
      //   }

      //   return quantityRef.current!.isGreaterThanOrEqualTo(value);
      // }),
    }),
  });

  const base = props.asset;
  const order = props.order;
  const quote = environment.getToken('WETH');
  const price = props.order?.price ?? new BigNumber('NaN');

  // The refs are used for form validation.
  const quantityRef = useRef(order?.quantity);
  const totalRef = useRef(order?.quantity.multipliedBy(price));

  useEffect(() => {
    const quantity = order?.quantity ?? new BigNumber('NaN');
    const total = quantity.multipliedBy(price);

    quantityRef.current = quantity;
    totalRef.current = total;

    form.setValue('quantity', !quantity.isNaN() ? quantity.toString() : '');
    form.setValue('total', !total.isNaN() ? total.toString() : '');
  }, [order]);

  const submit = form.handleSubmit(async values => {
    const hub = new Hub(environment, props.address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);
    const exchange = environment.getExchange(order!.exchange);

    const taker = order!.side === 'bid' ? base : quote;
    const maker = order!.side === 'bid' ? quote : base;
    const quantity = order!.side === 'bid' ? toTokenBaseUnit(values.quantity, taker.decimals) : toTokenBaseUnit(values.total, maker.decimals);

    if (exchange.id === ExchangeIdentifier.OasisDex) {
      const market = new OasisDexExchange(environment, exchange.exchange);
      const adapter = await OasisDexTradingAdapter.create(trading, exchange.exchange);
      const offer = await market.getOffer((order as OasisDexOrderbookItem).order.id);
      const tx = adapter.takeOrder(account.address!, order!.order.id, offer, quantity);
      return transaction.start(tx, 'Take order');
    }

    if (order!.exchange === ExchangeIdentifier.ZeroExV2) {
      const adapter = await ZeroExV2TradingAdapter.create(trading, exchange.exchange);
      const tx = adapter.takeOrder(account.address!, order!.order, quantity);
      return transaction.start(tx, 'Take order');
    }
  });

  const quantity = toBigNumber(form.watch('quantity'));
  const total = toBigNumber(form.watch('total'));

  const changeQuantity = (change: BigNumber.Value) => {
    const quantity = toBigNumber(change);
    const total = quantity.multipliedBy(price);
    form.setValue('total', !total.isNaN() ? total.decimalPlaces(4).toString() : '');
  }

  const changeTotal = (change: BigNumber.Value) => {
    const total = toBigNumber(change);
    const quantity = total.dividedBy(price);
    form.setValue('quantity', !quantity.isNaN() ? quantity.decimalPlaces(4).toString() : '');
  }

  const ready = !price.isNaN() && !quantity.isNaN() && !total.isNaN();
  const description = ready && `Market order: ${direction === 'buy' ? 'Buy' : 'Sell'} ${quantity.decimalPlaces(4).toString()} ${base.symbol} at a price of ${price.decimalPlaces(4).toString()} ${quote.symbol} per ${base.symbol} for a total of ${total.decimalPlaces(4).toString()} ${quote.symbol}`;

  return (
    <FormContext {...form}>
      {order && (
        <form onSubmit={submit}>
          <Dropdown name="direction" label="Buy or sell" options={directions} disabled={true} value={direction} />
          <Dropdown name="exchange" label="Exchange" options={exchanges} disabled={true} value={exchange} />
          <Input type="text" name="quantity" label={`Quantity (${base.symbol})`} onChange={event => changeQuantity(event.target.value)} />
          <Input type="text" name="price" label={`Price (${quote.symbol} per ${base.symbol})`} disabled={true} value={price.decimalPlaces(4).toString()} />
          <Input type="text" name="total" label={`Total (${quote.symbol})`} onChange={(event) => changeTotal(event.target.value)} />

          {description && (
            <NotificationBar kind="neutral">
              <NotificationContent>
                {description}
              </NotificationContent>
            </NotificationBar>
          )}

          <BlockActions>
            <Button type="button" disabled={!ready} onClick={submit}>
              Submit
            </Button>
          </BlockActions>
        </form>
      )}

      {!order && <>Please select an order.</>}

      <TransactionModal transaction={transaction} />
    </FormContext>
  );
};
