import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import * as Rx from 'rxjs';
import {
  TokenDefinition,
  Trading,
  Hub,
  ExchangeDefinition,
  UniswapTradingAdapter,
  UniswapExchange,
  UniswapFactory,
} from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { useTransaction } from '~/hooks/useTransaction';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { Holding } from '@melonproject/melongql';
import { Subtitle } from '~/storybook/components/Title/Title';
import { Button } from '~/storybook/components/Button/Button';
import { catchError, switchMap, map } from 'rxjs/operators';

export interface FundUniswapTradingProps {
  address: string;
  exchange: ExchangeDefinition;
  holdings: Holding[];
  maker: TokenDefinition;
  taker: TokenDefinition;
  quantity: BigNumber;
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
  const refetch = useOnChainQueryRefetcher();

  const transaction = useTransaction(environment, {
    onFinish: receipt => refetch(receipt.blockNumber),
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

    const observable$ = Rx.timer(500).pipe(
      switchMap(async () => {
        const weth = environment.getToken('WETH');
        const uniswapFactory = new UniswapFactory(environment, environment.deployment.uniswap.addr.UniswapFactory);
        const takerQty = toTokenBaseUnit(props.quantity, props.taker.decimals);

        if (props.taker.address === weth.address) {
          // Convert WETH into token.
          const exchangeAddress = await uniswapFactory.getExchange(props.maker.address);
          const exchange = new UniswapExchange(environment, exchangeAddress);
          const makerQty = await exchange.getEthToTokenInputPrice(takerQty);
          return makerQty.dividedBy(takerQty);
        }

        if (props.maker.address === weth.address) {
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
      }),
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
    const hub = new Hub(environment, props.address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);
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
      <Subtitle>Uniswap</Subtitle>
      <Button type="button" disabled={!ready} loading={loading} onClick={submit}>
        {loading ? '' : valid ? `Buy ${value.toFixed(4)} ${state.maker.symbol}` : 'No offer'}
      </Button>
      <TransactionModal transaction={transaction} />
    </>
  );
};
