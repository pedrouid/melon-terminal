import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import * as Rx from 'rxjs';
import { ExchangeDefinition, Trading, ZeroExV2TradingAdapter } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { useTransaction } from '~/hooks/useTransaction';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Button } from '~/storybook/components/Button/Button';
import { catchError, switchMap } from 'rxjs/operators';
import { SignedOrder } from '@0x/order-utils-v2';
import { Subtitle } from '~/storybook/components/Title/Title';

export interface FundRequestForQuoteOfferProps {
  active: boolean;
  trading: string;
  exchange: ExchangeDefinition;
  market?: string;
  amount?: BigNumber;
  symbol?: string;
  side?: 'buy' | 'sell';
}

export const FundRequestForQuoteOffer: React.FC<FundRequestForQuoteOfferProps> = props => {
  const [state, setState] = useState(() => ({
    price: new BigNumber(0),
    loading: false,
  }));

  const environment = useEnvironment()!;
  const account = useAccount()!;
  const refetch = useOnChainQueryRefetcher();

  const loading = state.loading;
  const active = !!(props.market && props.side && props.amount && !props.amount.isNaN() && !props.amount.isZero());
  const ready = active && !state.loading && !state.price.isZero();

  const transaction = useTransaction(environment, {
    onFinish: receipt => refetch(receipt.blockNumber),
  });

  useEffect(() => {
    setState(() => ({
      price: new BigNumber(0),
      loading: true,
    }));

    // Refetch every 10 seconds.
    const observable$ = Rx.timer(500).pipe(
      switchMap(async () => {
        const result = await (
          await fetch(`${process.env.MELON_API_GATEWAY}/rfq/quotes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              market: props.market!,
              side: props.side!,
              amount: props.amount!.toString(),
              model: 'indicative',
              profile: 'melon',
              meta: { taker: props.trading },
            }),
          })
        ).json();

        return props.side === 'buy'
          ? new BigNumber(result.price ?? 0)
          : new BigNumber(1).dividedBy(result.price ?? 'NaN');
      }),
      catchError(() => Rx.of(new BigNumber(0)))
    );

    const empty$ = Rx.of(new BigNumber(0));
    const subscription = (active ? observable$ : empty$).subscribe(price => {
      setState(() => ({
        price,
        loading: false,
      }));
    });

    return () => subscription.unsubscribe();
  }, [props.market, props.side, props.amount?.valueOf()]);

  const submit = async () => {
    try {
      const result = await (
        await fetch(`${process.env.MELON_API_GATEWAY}/rfq/quotes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            market: props.market,
            side: props.side,
            amount: props.amount!.toString(),
            model: 'firm',
            profile: 'melon',
            meta: { taker: props.trading },
          }),
        })
      ).json();

      if (result?.data) {
        const order = result.data['0xv2order'] as SignedOrder;
        const trading = new Trading(environment, props.trading);
        const adapter = await ZeroExV2TradingAdapter.create(environment, props.exchange.exchange, trading);
        const tx = adapter.takeOrder(account.address!, {
          ...order,
          expirationTimeSeconds: new BigNumber(order.expirationTimeSeconds),
          takerAssetAmount: new BigNumber(order.takerAssetAmount),
          takerFee: new BigNumber(order.takerFee),
          makerAssetAmount: new BigNumber(order.makerAssetAmount),
          makerFee: new BigNumber(order.makerFee),
          salt: new BigNumber(order.salt),
        });

        transaction.start(tx, 'Take order');
      }
    } catch (e) {
      // TODO: Handle errors.
    }
  };

  return (
    <>
      <Subtitle>Offer</Subtitle>
      <Button type="button" disabled={!(ready && props.active)} loading={loading} onClick={submit}>
        {loading
          ? ''
          : ready
          ? `Buy ${state.price.multipliedBy(props.amount!).toFixed(4)} ${props.symbol}`
          : 'No offer'}
      </Button>

      <TransactionModal transaction={transaction} />
    </>
  );
};
