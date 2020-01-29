import React, { useMemo, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import * as Yup from 'yup';
import * as Rx from 'rxjs';
import { equals } from 'ramda';
import { useForm, FormContext } from 'react-hook-form';
import {
  TokenDefinition,
  Trading,
  Hub,
  ExchangeDefinition,
  sameAddress,
  UniswapTradingAdapter,
  UniswapFactory,
  UniswapExchange,
} from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { Input } from '~/storybook/components/Input/Input';
import { Button } from '~/storybook/components/Button/Button';
import { distinctUntilChanged, debounceTime, switchMap, tap, take, skip, share } from 'rxjs/operators';
import { useAccount } from '~/hooks/useAccount';
import { useTransaction } from '~/hooks/useTransaction';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { Holding } from '@melonproject/melongql';
import { Icons } from '~/storybook/components/Icons/Icons';

export interface FundUniswapTradingProps {
  address: string;
  exchange: ExchangeDefinition;
  holdings: Holding[];
  asset?: TokenDefinition;
}

interface FundUniswapTradingFormValues {
  makerAsset: string;
  takerAsset: string;
  takerQuantity: string;
}

export const FundUniswapTrading: React.FC<FundUniswapTradingProps> = props => {
  const [price, setPrice] = useState(new BigNumber(0));
  const [loading, setLoading] = useState(true);
  const environment = useEnvironment()!;
  const account = useAccount()!;
  const refetch = useOnChainQueryRefetcher();

  const uniswapFactory = new UniswapFactory(environment, environment.deployment.uniswap.addr.UniswapFactory);

  const weth = environment.getToken('WETH')!;
  const options = environment.tokens
    .filter(item => !item.historic)
    .map(token => ({
      value: token.address,
      name: token.symbol,
      decimals: token.decimals,
    }));

  const defaultValues = {
    makerAsset: options[1].value,
    takerAsset: options[0].value,
    takerQuantity: '1',
  };

  const form = useForm<FundUniswapTradingFormValues>({
    defaultValues,
    validationSchema: Yup.object().shape({
      makerAsset: Yup.string().required(),
      takerAsset: Yup.string().required(),
      takerQuantity: Yup.string()
        .required('This is a required value.')
        // tslint:disable-next-line
        .test('not-a-number', 'The given value is not a valid number.', function(value) {
          return !new BigNumber(value).isNaN();
        })
        // tslint:disable-next-line
        .test('not-positive', 'The given value is not a valid number.', function(value) {
          return new BigNumber(value).isPositive();
        })
        // tslint:disable-next-line
        .test('balance-too-low', 'Your current balance is too low.', function(value) {
          const holding = props.holdings.find(item => sameAddress(item.token!.address, this.parent.takerAsset))!;
          const divisor = new BigNumber(10).exponentiatedBy(holding.token!.decimals!);
          const balance = holding.amount!.dividedBy(divisor);
          return new BigNumber(value).isLessThanOrEqualTo(balance);
        }),
    }),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const transaction = useTransaction(environment, {
    onFinish: receipt => refetch(receipt.blockNumber),
    onAcknowledge: () => form.reset(defaultValues),
  });

  const makerAsset = environment.getToken(form.watch('makerAsset')!);
  const takerAsset = environment.getToken(form.watch('takerAsset')!);
  const takerQuantity = new BigNumber(form.watch('takerQuantity'));
  const makerQuantity = takerQuantity.multipliedBy(price);

  const taker$ = useMemo(() => new Rx.BehaviorSubject(takerAsset), []);
  const maker$ = useMemo(() => new Rx.BehaviorSubject(makerAsset), []);
  const quantity$ = useMemo(() => new Rx.BehaviorSubject(takerQuantity), []);

  useEffect(() => maker$.next(makerAsset), [makerAsset]);
  useEffect(() => taker$.next(takerAsset), [takerAsset]);
  useEffect(() => quantity$.next(takerQuantity), [takerQuantity]);

  const stream$ = useMemo(() => {
    const changes$ = Rx.combineLatest([taker$, maker$, quantity$], (taker, maker, quantity) => ({
      taker,
      maker,
      quantity,
    })).pipe(share());

    const first$ = changes$.pipe(take(1));
    const followup$ = changes$.pipe(skip(1), debounceTime(500));
    const values$ = Rx.concat(first$, followup$).pipe(distinctUntilChanged((a, b) => equals(a, b)));

    return values$.pipe(
      tap(() => setLoading(true)),
      switchMap(async ({ taker, maker, quantity }) => {
        const expected = await new Promise<BigNumber>(async resolve => {
          const takerQty = toTokenBaseUnit(quantity, taker!.decimals);

          try {
            if (taker.address === weth.address) {
              // convert WETH into token
              const exchangeAddress = await uniswapFactory.getExchange(maker.address);
              const exchange = new UniswapExchange(environment, exchangeAddress);
              const makerQty = await exchange.getEthToTokenInputPrice(takerQty);

              resolve(makerQty.dividedBy(takerQty));
            } else if (maker.address === weth.address) {
              // convert token into WETH
              const exchangeAddress = await uniswapFactory.getExchange(taker.address);
              const exchange = new UniswapExchange(environment, exchangeAddress);
              const makerQty = await exchange.getTokenToEthInputPrice(takerQty);

              resolve(makerQty.dividedBy(takerQty));
            } else {
              // convert token into token
              const [sourceExchangeAddress, targetExchangeAddress] = await Promise.all([
                uniswapFactory.getExchange(taker.address),
                uniswapFactory.getExchange(maker.address),
              ]);
              const sourceExchange = new UniswapExchange(environment, sourceExchangeAddress);
              const targetExchange = new UniswapExchange(environment, targetExchangeAddress);
              const intermediateEth = await sourceExchange.getTokenToEthInputPrice(takerQty);
              const makerQty = await targetExchange.getEthToTokenInputPrice(intermediateEth);

              resolve(makerQty.dividedBy(takerQty));
            }
          } catch (e) {
            resolve(new BigNumber(0));
          }
        });

        return expected.multipliedBy(new BigNumber(10).exponentiatedBy(taker.decimals - maker.decimals));
      }),
      tap(price => setPrice(price)),
      tap(() => setLoading(false))
    );
  }, [taker$, maker$, quantity$]);

  useEffect(() => {
    const subscription = stream$.subscribe();
    return () => subscription.unsubscribe();
  }, [stream$]);

  const submit = form.handleSubmit(async () => {
    const hub = new Hub(environment, props.address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);
    const adapter = await UniswapTradingAdapter.create(environment, props.exchange.exchange, trading);

    const tx = adapter.takeOrder(account.address!, {
      makerQuantity: toTokenBaseUnit(makerQuantity, makerAsset.decimals),
      takerQuantity: toTokenBaseUnit(takerQuantity, takerAsset.decimals),
      makerAsset: makerAsset.address,
      takerAsset: takerAsset.address,
    });

    transaction.start(tx, 'Take order');
  });

  const swapAssets = () => {
    const values = form.getValues();
    form.setValue('makerAsset', values.takerAsset);
    form.setValue('takerAsset', values.makerAsset);
    form.setValue('takerQuantity', makerQuantity.toString());
  };

  return (
    <>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <Grid>
            <GridRow noGap={true}>
              <GridCol xs={12} sm={3}>
                <Dropdown name="takerAsset" label="Sell asset" options={options} disabled={loading} />
              </GridCol>

              <GridCol xs={12} sm={9}>
                <Input type="number" step="any" name="takerQuantity" label="Sell quantity" />
              </GridCol>
            </GridRow>

            <GridRow noGap={true}>
              <GridCol xs={12} sm={3}>
                <Icons name="SWAPARROWS" onClick={swapAssets} pointer={true} />
              </GridCol>
            </GridRow>

            <GridRow>
              <GridCol xs={12} sm={3}>
                <Dropdown name="makerAsset" label="Buy asset" options={options} disabled={loading} />
              </GridCol>

              <GridCol xs={12} sm={9}>
                <Input
                  type="text"
                  label="Buy quantity"
                  value={makerQuantity.isNaN() ? '' : makerQuantity.toFixed(4)}
                  disabled={true}
                />
              </GridCol>
            </GridRow>

            <GridRow>
              <GridCol>
                {!loading && (
                  <>
                    {!price.isFinite() ? (
                      <div>No liquidity for this quantity.</div>
                    ) : (
                      <div>
                        1 {takerAsset!.symbol} = <FormattedNumber value={price} /> {makerAsset!.symbol}
                      </div>
                    )}
                  </>
                )}
              </GridCol>
            </GridRow>

            <GridRow>
              <GridCol>
                <Button type="submit" loading={loading} disabled={loading || price.isNaN() || price.isZero()}>
                  Submit
                </Button>
              </GridCol>
            </GridRow>
          </Grid>
        </form>
      </FormContext>

      <TransactionModal transaction={transaction} />
    </>
  );
};
