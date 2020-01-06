import React from 'react';
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
} from '@melonproject/melonjs';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { Button } from '~/storybook/components/Button/Button';
import { FormField } from '~/storybook/components/FormField/FormField';
import { Input } from '~/storybook/components/Input/Input';
import { OrderbookItem } from '../../FundOrderbook/utils/aggregatedOrderbook';
import { useAccount } from '~/hooks/useAccount';
import { MatchingMarketOrderbookItem } from '../../FundOrderbook/utils/matchingMarketOrderbook';

export interface FundOrderbookMarketFormProps {
  address: string;
  asset?: TokenDefinition;
  exchanges: ExchangeDefinition[];
  order?: OrderbookItem;
}

export const FundOrderbookMarketForm: React.FC<FundOrderbookMarketFormProps> = props => {
  const environment = useEnvironment()!;
  const account = useAccount()!;
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment, {
    onFinish: () => refetch(),
  });

  const exchanges = props.exchanges.map(item => ({
    value: item.name,
    name: item.name,
  }));

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

  const submit = async () => {
    const order = props.order!;
    const hub = new Hub(environment, props.address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);
    const exchange = environment.getExchange(order.exchange);

    if (exchange.id === ExchangeIdentifier.OasisDex) {
      const market = new MatchingMarket(environment, exchange.exchange);
      const adapter = await OasisDexTradingAdapter.create(trading, exchange.exchange);
      const offer = await market.getOffer((order as MatchingMarketOrderbookItem).order.id);
      const tx = adapter.takeOrder(account.address!, order.order.id, offer);
      return transaction.start(tx, 'Take order');
    }

    if (order.exchange === ExchangeIdentifier.ZeroEx) {
      // TODO: Implement.
    }
  };

  return (
    <>
      {props.order && (
        <>
          <FormField label="Direction" name="direction">
            <Dropdown name="direction" options={directions} disabled={true} value={direction} />
          </FormField>

          <FormField label="Exchange" name="exchange">
            <Dropdown name="exchange" options={exchanges} disabled={true} />
          </FormField>

          <FormField label="Quantity" name="quantity">
            <Input type="number" name="quantity" disabled={true} value={props.order.quantity.toFixed()} />
          </FormField>

          <FormField label="Price" name="price">
            <Input type="number" name="price" disabled={true} value={props.order.price.toFixed()} />
          </FormField>

          <Button type="button" onClick={submit}>
            Submit
          </Button>
        </>
      )}

      {!props.order && <>Please select an order.</>}

      <TransactionModal transaction={transaction} />
    </>
  );
};
