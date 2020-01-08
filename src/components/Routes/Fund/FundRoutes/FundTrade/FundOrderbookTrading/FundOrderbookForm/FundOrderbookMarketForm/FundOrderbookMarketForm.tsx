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
  MatchingMarket,
  ZeroExTradingAdapter,
  ZeroExOrder,
} from '@melonproject/melonjs';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { Button } from '~/storybook/components/Button/Button';
import { FormField } from '~/storybook/components/FormField/FormField';
import { Input } from '~/storybook/components/Input/Input';
import { OrderbookItem } from '../../FundOrderbook/utils/aggregatedOrderbook';
import { useAccount } from '~/hooks/useAccount';
import { MatchingMarketOrderbookItem } from '../../FundOrderbook/utils/matchingMarketOrderbook';
import useForm, { FormContext } from 'react-hook-form';
import BigNumber from 'bignumber.js';

export interface FundOrderbookMarketFormProps {
  address: string;
  asset?: TokenDefinition;
  exchanges: ExchangeDefinition[];
  order?: OrderbookItem;
  unsetOrder: () => void;
}

export const FundOrderbookMarketForm: React.FC<FundOrderbookMarketFormProps> = props => {
  const environment = useEnvironment()!;
  const account = useAccount()!;
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment, {
    onFinish: () => {
      props.unsetOrder();
      refetch();
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

  const quantity = useRef(props.order?.quantity);
  const form = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      quantity: undefined,
    },
    validationSchema: Yup.object().shape({
      quantity: Yup.string()
        .required()
        .test('max', 'Maximum quantity exceeded', value => {
          if (!quantity.current) {
            return false;
          }

          return quantity.current!.isGreaterThanOrEqualTo(value);
        }),
    }),
  });

  useEffect(() => {
    quantity.current = props.order?.quantity;
    form.setValue('quantity', props.order?.quantity.toString());
  }, [props.order?.quantity.toString()]);

  const submit = form.handleSubmit(async values => {
    const order = props.order!;
    const hub = new Hub(environment, props.address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);
    const exchange = environment.getExchange(order.exchange);
    const taker = props.order!.side === 'bid' ? props.asset! : environment.getToken('WETH');

    if (exchange.id === ExchangeIdentifier.OasisDex) {
      const market = new MatchingMarket(environment, exchange.exchange);
      const adapter = await OasisDexTradingAdapter.create(trading, exchange.exchange);
      const offer = await market.getOffer((order as MatchingMarketOrderbookItem).order.id);
      const quantity = !offer.takerQuantity.isEqualTo(values.quantity)
        ? order.price.multipliedBy(values.quantity).multipliedBy(new BigNumber(10).exponentiatedBy(taker.decimals))
        : undefined;

      const tx = adapter.takeOrder(account.address!, order.order.id, offer, quantity);
      return transaction.start(tx, 'Take order');
    }

    if (order.exchange === ExchangeIdentifier.ZeroEx) {
      const adapter = await ZeroExTradingAdapter.create(trading, exchange.exchange);
      const offer = order.order as ZeroExOrder;
      const quantity = !offer.takerAssetAmount.isEqualTo(values.quantity)
        ? order.price.multipliedBy(values.quantity).multipliedBy(new BigNumber(10).exponentiatedBy(taker.decimals))
        : undefined;

      const tx = adapter.takeOrder(account.address!, order.order, quantity);
      return transaction.start(tx, 'Take order');
    }
  });

  return (
    <FormContext {...form}>
      {props.order && (
        <form onSubmit={submit}>
          <FormField name="direction">
            <Dropdown name="direction" options={directions} disabled={true} value={direction} />
          </FormField>

          <FormField name="exchange">
            <Dropdown name="exchange" options={exchanges} disabled={true} value={exchange} />
          </FormField>

          <FormField label="Quantity" name="quantity">
            <Input type="text" name="quantity" max={props.order.quantity.toFixed()} />
          </FormField>

          <FormField label="Price" name="price">
            <Input type="text" name="price" disabled={true} value={props.order.price.toFixed()} />
          </FormField>

          <Button type="button" onClick={submit}>
            Submit
          </Button>
        </form>
      )}

      {!props.order && <>Please select an order.</>}

      <TransactionModal transaction={transaction} />
    </FormContext>
  );
};
