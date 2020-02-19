import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import * as Rx from 'rxjs';
import {
  TokenDefinition,
  KyberNetworkProxy,
  Trading,
  KyberTradingAdapter,
  ExchangeDefinition,
  sameAddress,
} from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { Holding } from '@melonproject/melongql';
import { Subtitle } from '~/storybook/components/Title/Title';
import { Button } from '~/storybook/components/Button/Button';
import { catchError, map, expand, switchMapTo } from 'rxjs/operators';

export interface FundKyberTradingProps {
  trading: string;
  exchange: ExchangeDefinition;
  holdings: Holding[];
  maker: TokenDefinition;
  taker: TokenDefinition;
  quantity: BigNumber;
  active: boolean;
}

export const FundKyberTrading: React.FC<FundKyberTradingProps> = props => {
  const [state, setState] = useState(() => ({
    rate: new BigNumber('NaN'),
    maker: props.maker,
    taker: props.taker,
    quantity: props.quantity,
    state: 'loading',
  }));

  const environment = useEnvironment()!;
  const account = useAccount()!;

  const transaction = useTransaction(environment, {
    handleError: () => 'The transaction failed. The rate offered by the exchange may have changed. Please try again.',
  });

  useEffect(() => {
    setState(previous => ({
      ...previous,
      maker: props.maker,
      taker: props.taker,
      quantity: props.quantity,
      state: 'loading',
      // Reset the rate if the maker or taker have changed.
      ...(!(props.maker === state.maker && props.taker === state.taker) && { rate: new BigNumber('NaN') }),
    }));

    const fetch$ = Rx.defer(async () => {
      const weth = environment.getToken('WETH');
      const contract = new KyberNetworkProxy(environment, environment.deployment.kyber.addr.KyberNetworkProxy);
      const kyberEth = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
      const srcToken = sameAddress(props.taker.address, weth.address) ? kyberEth : props.taker.address;
      const destToken = sameAddress(props.maker.address, weth.address) ? kyberEth : props.maker.address;
      const srcQty = toTokenBaseUnit(props.quantity, props.taker.decimals);

      const expected = await contract.getExpectedRate(srcToken, destToken, srcQty);

      return expected.expectedRate;
    });

    // Refetch every 5 seconds.
    const polling$ = fetch$.pipe(expand(() => Rx.timer(5000).pipe(switchMapTo(fetch$))));
    const observable$ = polling$.pipe(
      catchError(() => Rx.of(new BigNumber(0))),
      map(value => fromTokenBaseUnit(value, 18))
    );

    const subscription = observable$.subscribe(rate => {
      setState(previous => ({
        ...previous,
        rate,
        state: 'idle',
      }));
    });

    return () => subscription.unsubscribe();
  }, [props.maker, props.taker, props.quantity.valueOf()]);

  const valid = !state.rate.isNaN() && !state.rate.isZero();
  const value = props.quantity.multipliedBy(state.rate);
  const loading = state.state === 'loading';
  const ready = !loading && valid;

  const submit = async () => {
    const trading = new Trading(environment, props.trading);
    const adapter = await KyberTradingAdapter.create(environment, props.exchange.exchange, trading);

    const tx = adapter.takeOrder(account.address!, {
      makerQuantity: toTokenBaseUnit(value, props.maker.decimals),
      takerQuantity: toTokenBaseUnit(props.quantity, props.taker.decimals),
      makerAsset: props.maker.address,
      takerAsset: props.taker.address,
    });

    transaction.start(tx, 'Take order');
  };

  return (
    <>
      <Subtitle>
        Kyber Network (1 {state.taker.symbol} = {state.rate.toFixed(4)} {state.maker.symbol})
      </Subtitle>
      <Button type="button" disabled={!ready || !props.active} loading={loading} onClick={submit}>
        {loading ? '' : valid ? `Buy ${value.toFixed(4)} ${state.maker.symbol}` : 'No offer'}
      </Button>

      <TransactionModal transaction={transaction} />
    </>
  );
};
