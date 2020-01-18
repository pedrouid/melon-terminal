import React, { useMemo, useEffect, useState, useLayoutEffect } from 'react';
import BigNumber from 'bignumber.js';
import * as Yup from 'yup';
import * as Rx from 'rxjs';
import { equals } from 'ramda';
import useForm, { FormContext } from 'react-hook-form';
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
import { FormField } from '~/storybook/components/FormField/FormField';
import { Input } from '~/storybook/components/Input/Input';
import { Button } from '~/storybook/components/Button/Button';
import { startWith, scan, distinctUntilChanged, debounceTime, switchMap, tap } from 'rxjs/operators';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { useAccount } from '~/hooks/useAccount';
import { useTransaction } from '~/hooks/useTransaction';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { useFundHoldingsQuery } from '~/queries/FundHoldings';

export interface FundKyberTradingProps {
  address: string;
  exchange: ExchangeDefinition;
  asset?: TokenDefinition;
}

const validationSchema = Yup.object().shape({
  makerAsset: Yup.string().required(),
  takerAsset: Yup.string().required(),
  makerQuantity: Yup.number()
    .required()
    .positive(),
  takerQuantity: Yup.number()
    .required()
    .positive(),
});

interface FundKyberTradingFormValues {
  makerAsset?: string;
  takerAsset?: string;
  makerQuantity?: string;
  takerQuantity: string;
}

export const FundKyberTrading: React.FC<FundKyberTradingProps> = props => {
  const [price, setPrice] = useState(new BigNumber(0));
  const [loading, setLoading] = useState(true);
  const environment = useEnvironment()!;
  const account = useAccount()!;
  const refetch = useOnChainQueryRefetcher();

  const weth = environment.getToken('WETH')!;
  const options = environment.tokens.map(token => ({
    value: token.address,
    name: token.symbol,
  }));

  const defaultValues = {
    makerAsset: options[1].value,
    takerAsset: options[0].value,
    takerQuantity: '',
  };

  const form = useForm<FundKyberTradingFormValues>({
    defaultValues,
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const transaction = useTransaction(environment, {
    onFinish: (receipt) => refetch(receipt.blockNumber),
    onAcknowledge: () => form.reset(defaultValues),
  });

  const makerAddress = form.watch('makerAsset');
  const takerAddress = form.watch('takerAsset');
  const takerQuantity = form.watch('takerQuantity');
  const makerAsset = makerAddress ? environment.getToken(makerAddress) : undefined;
  const takerAsset = takerAddress ? environment.getToken(takerAddress) : undefined;

  const [holdings, _] = useFundHoldingsQuery(props.address);
  const takerAssetHolding = holdings.find(holding => sameAddress(holding.token?.address, takerAddress));
  const takerAssetHoldingAmount = takerAssetHolding?.amount || new BigNumber(0);

  useEffect(() => {
    if (
      takerAssetHoldingAmount.isLessThan(
        new BigNumber(takerQuantity).multipliedBy(new BigNumber(10).exponentiatedBy(takerAsset?.decimals || 18))
      )
    ) {
      form.setError('takerQuantity', 'tooLow', `Your ${takerAsset?.symbol} balance is too low`);
    } else {
      form.clearError('takerQuantity');
    }
  }, [takerAssetHoldingAmount, takerQuantity]);

  const changes$ = useMemo(() => new Rx.Subject<[string, string]>(), []);
  const stream$ = useMemo(() => {
    const contract = new KyberNetworkProxy(environment, environment.deployment.kyber.addr.KyberNetworkProxy);
    const scanned$ = Rx.from(changes$).pipe(scan((carry, [key, value]) => ({ ...carry, [key]: value }), defaultValues));
    const values$ = scanned$.pipe(
      debounceTime(500),
      startWith(defaultValues),
      distinctUntilChanged((a, b) => equals(a, b))
    );

    return values$.pipe(
      tap(() => setLoading(true)),
      switchMap(async values => {
        const expected = await new Promise<BigNumber>(async resolve => {
          try {
            const kyberEth = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
            const srcToken = values.takerAsset === weth.address ? kyberEth : values.takerAsset;
            const destToken = values.makerAsset === weth.address ? kyberEth : values.makerAsset;
            const srcQty = new BigNumber(values.takerQuantity).multipliedBy(
              new BigNumber(10).exponentiatedBy(takerAsset?.decimals || 18)
            );
            const result = await contract.getExpectedRate(srcToken, destToken, srcQty);

            resolve(result.expectedRate);
          } catch (e) {
            resolve(new BigNumber(0));
          }
        });

        return expected.dividedBy(new BigNumber(10).exponentiatedBy(18));
      }),
      tap(price => setPrice(price)),
      tap(() => setLoading(false))
    );
  }, [changes$]);

  useEffect(() => {
    const subscription = stream$.subscribe();
    return () => subscription.unsubscribe();
  }, [stream$]);

  useLayoutEffect(() => {
    const qty = new BigNumber(takerQuantity ?? 0).multipliedBy(price);
    form.setValue('makerQuantity', qty.toFixed(4));
  }, [price, takerQuantity]);

  const submit = form.handleSubmit(async data => {
    const hub = new Hub(environment, props.address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);
    const adapter = await KyberTradingAdapter.create(trading, props.exchange.exchange);

    // Don't use the maker quantity form value, it's rounded.
    const takerQuantity = new BigNumber(data.takerQuantity);
    const makerQuantity = takerQuantity.multipliedBy(price);

    const tx = adapter.takeOrder(account.address!, {
      makerQuantity: makerQuantity.multipliedBy(new BigNumber(10).exponentiatedBy(makerAsset!.decimals)),
      takerQuantity: takerQuantity.multipliedBy(new BigNumber(10).exponentiatedBy(takerAsset!.decimals)),
      makerAsset: data.makerAsset!,
      takerAsset: data.takerAsset!,
    });

    transaction.start(tx, 'Take order');
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    changes$.next([event.target.name, event.target.value]);

  return (
    <>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <Grid>
            <GridRow>
              <GridCol xs={2}>
                <FormField name="takerAsset" label="Sell asset">
                  <Dropdown name="takerAsset" options={options} onChange={handleChange} disabled={loading} />
                </FormField>
              </GridCol>

              <GridCol xs={10}>
                <FormField name="takerQuantity" label="Sell quantity">
                  <Input type="number" step="any" name="takerQuantity" onChange={handleChange} />
                </FormField>
              </GridCol>
            </GridRow>

            <GridRow>
              <GridCol xs={2}>
                <FormField name="makerAsset" label="Buy asset">
                  <Dropdown name="makerAsset" options={options} onChange={handleChange} disabled={loading} />
                </FormField>
              </GridCol>

              <GridCol xs={10}>
                <FormField name="makerQuantity" label="Buy quantity">
                  <Input type="number" step="any" name="makerQuantity" disabled={true} />
                </FormField>
              </GridCol>
            </GridRow>

            <GridRow>
              <GridCol>
                {!loading && !price.isFinite() && <div>No liquidity for this quantity.</div>}
                {!loading && price.isFinite() && (
                  <div>
                    1 {takerAsset?.symbol ?? 'N/A'} = <FormattedNumber value={price} /> {makerAsset?.symbol ?? 'N/A'}
                  </div>
                )}
              </GridCol>
            </GridRow>

            {loading && <Spinner />}

            <GridRow>
              <GridCol>
                <Button type="submit" disabled={loading}>
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
