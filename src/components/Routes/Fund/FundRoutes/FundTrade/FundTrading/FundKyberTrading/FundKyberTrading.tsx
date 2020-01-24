import React, { useMemo, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import * as Yup from 'yup';
import * as Rx from 'rxjs';
import { equals } from 'ramda';
import { useForm, FormContext } from 'react-hook-form';
import {
  TokenDefinition,
  KyberNetworkProxy,
  Trading,
  Hub,
  KyberTradingAdapter,
  ExchangeDefinition,
  sameAddress,
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
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { Holding } from '@melonproject/melongql';

export interface FundKyberTradingProps {
  address: string;
  exchange: ExchangeDefinition;
  holdings: Holding[];
  asset?: TokenDefinition;
}

interface FundKyberTradingFormValues {
  makerAsset: string;
  takerAsset: string;
  takerQuantity: string;
}

export const FundKyberTrading: React.FC<FundKyberTradingProps> = props => {
  const [price, setPrice] = useState(new BigNumber(0));
  const [loading, setLoading] = useState(true);
  const environment = useEnvironment()!;
  const account = useAccount()!;
  const refetch = useOnChainQueryRefetcher();

  const weth = environment.getToken('WETH')!;
  const options = environment.tokens
    .filter(item => !item.historic)
    .map(token => ({
      value: token.address,
      name: token.symbol,
    }));

  const defaultValues = {
    makerAsset: options[1].value,
    takerAsset: options[0].value,
    takerQuantity: '1',
  };

  const form = useForm<FundKyberTradingFormValues>({
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
    const contract = new KyberNetworkProxy(environment, environment.deployment.kyber.addr.KyberNetworkProxy);
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
          try {
            const kyberEth = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
            const srcToken = taker.address === weth.address ? kyberEth : taker.address;
            const destToken = maker.address === weth.address ? kyberEth : maker.address;
            const srcQty = toTokenBaseUnit(quantity, taker!.decimals);
            const result = await contract.getExpectedRate(srcToken, destToken, srcQty);

            resolve(result.expectedRate);
          } catch (e) {
            resolve(new BigNumber(0));
          }
        });

        return fromTokenBaseUnit(expected, 18);
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
    const adapter = await KyberTradingAdapter.create(trading, props.exchange.exchange);

    const tx = adapter.takeOrder(account.address!, {
      makerQuantity: toTokenBaseUnit(makerQuantity, makerAsset.decimals),
      takerQuantity: toTokenBaseUnit(takerQuantity, takerAsset.decimals),
      makerAsset: makerAsset.address,
      takerAsset: takerAsset.address,
    });

    transaction.start(tx, 'Take order');
  });

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
