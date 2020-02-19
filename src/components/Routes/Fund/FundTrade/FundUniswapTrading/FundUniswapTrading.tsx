import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import * as Rx from 'rxjs';
import {
  TokenDefinition,
  Trading,
  ExchangeDefinition,
  UniswapTradingAdapter,
  UniswapExchange,
  UniswapFactory,
  sameAddress,
} from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { Holding } from '@melonproject/melongql';
import { Subtitle } from '~/storybook/components/Title/Title';
import { Button } from '~/storybook/components/Button/Button';
import { catchError, map, switchMapTo, expand } from 'rxjs/operators';

export interface FundUniswapTradingProps {
  trading: string;
  exchange: ExchangeDefinition;
  holdings: Holding[];
  maker: TokenDefinition;
  taker: TokenDefinition;
  quantity: BigNumber;
  active: boolean;
}

export const FundUniswapTrading: React.FC<FundUniswapTradingProps> = props => {
  const [state, setState] = useState(() => ({
    rate: new BigNumber('NaN'),
    maker: props.maker,
    taker: props.taker,
    quantity: props.quantity,
    state: 'loading',
  }));

  const environment = useEnvironment()!;
  const account = useAccount()!;

  const transaction = useTransaction(environment);

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
      const uniswapFactory = new UniswapFactory(environment, environment.deployment.uniswap.addr.UniswapFactory);
      const takerQty = toTokenBaseUnit(props.quantity, props.taker.decimals);

      if (sameAddress(props.taker.address, weth.address)) {
        // Convert WETH into token.
        const exchangeAddress = await uniswapFactory.getExchange(props.maker.address);
        const exchange = new UniswapExchange(environment, exchangeAddress);
        const makerQty = await exchange.getEthToTokenInputPrice(takerQty);
        return makerQty.dividedBy(takerQty);
      }

      if (sameAddress(props.maker.address, weth.address)) {
        // Convert token into WETH.
        const exchangeAddress = await uniswapFactory.getExchange(props.taker.address);
        const exchange = new UniswapExchange(environment, exchangeAddress);
        const makerQty = await exchange.getTokenToEthInputPrice(takerQty);
        return makerQty.dividedBy(takerQty);
      }

      // Convert token into token.
      const [sourceExchangeAddress, targetExchangeAddress] = await Promise.all([
        uniswapFactory.getExchange(props.taker.address),
        uniswapFactory.getExchange(props.maker.address),
      ]);

      const sourceExchange = new UniswapExchange(environment, sourceExchangeAddress);
      const targetExchange = new UniswapExchange(environment, targetExchangeAddress);
      const intermediateEth = await sourceExchange.getTokenToEthInputPrice(takerQty);
      const makerQty = await targetExchange.getEthToTokenInputPrice(intermediateEth);
      return makerQty.dividedBy(takerQty);
    });

    // Refetch every 5 seconds.
    const polling$ = fetch$.pipe(expand(() => Rx.timer(5000).pipe(switchMapTo(fetch$))));
    const observable$ = polling$.pipe(
      catchError(() => Rx.of(new BigNumber(0))),
      map(value => value.multipliedBy(new BigNumber(10).exponentiatedBy(props.taker.decimals - props.maker.decimals)))
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
    const adapter = await UniswapTradingAdapter.create(environment, props.exchange.exchange, trading);

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
        Uniswap (1 {state.taker.symbol} = {state.rate.toFixed(4)} {state.maker.symbol})
      </Subtitle>

      <Button type="button" disabled={!ready || !props.active} loading={loading} onClick={submit}>
        {loading ? '' : valid ? `Buy ${value.toFixed(4)} ${state.maker.symbol}` : 'No offer'}
      </Button>
      <TransactionModal transaction={transaction} />
    </>
  );
};
