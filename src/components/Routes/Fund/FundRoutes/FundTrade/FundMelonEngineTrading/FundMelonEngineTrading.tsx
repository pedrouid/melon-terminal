import React, { useMemo, useEffect, useState, useLayoutEffect } from 'react';
import BigNumber from 'bignumber.js';
import * as Yup from 'yup';
import * as Rx from 'rxjs';
import { toWei, fromWei } from 'web3-utils';
import { equals } from 'ramda';
import useForm, { FormContext } from 'react-hook-form';
import {
  TokenDefinition,
  KyberNetworkProxy,
  Trading,
  Hub,
  KyberTradingAdapter,
  ExchangeDefinition,
} from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { FormField } from '~/storybook/components/FormField/FormField';
import { Input } from '~/storybook/components/Input/Input';
import { Button } from '~/storybook/components/Button/Button';
import { startWith, scan, distinctUntilChanged, debounceTime, switchMap, tap } from 'rxjs/operators';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { useAccount } from '~/hooks/useAccount';
import { useTransaction } from '~/hooks/useTransaction';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';

export interface FundMelonEngineTradingProps {
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

interface FundMelonEngineTradingFormValues {
  makerAsset?: string;
  takerAsset?: string;
  makerQuantity?: string;
  takerQuantity?: string;
}

export const FundMelonEngineTrading: React.FC<FundMelonEngineTradingProps> = props => {
  const [price, setPrice] = useState('0');
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
    makerAsset: options[0].value,
    takerAsset: options[1].value,
    makerQuantity: '',
  };

  const form = useForm<FundMelonEngineTradingFormValues>({
    defaultValues,
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const transaction = useTransaction(environment, {
    onFinish: () => refetch(),
    onAcknowledge: () => form.reset(defaultValues),
  });

  const makerQuantity = form.watch('makerQuantity');
  const makerAddress = form.watch('makerAsset');
  const takerAddress = form.watch('takerAsset');
  const makerAsset = makerAddress ? environment.getToken(makerAddress) : undefined;
  const takerAsset = takerAddress ? environment.getToken(takerAddress) : undefined;

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
            const makerAddress = values.makerAsset === weth.address ? kyberEth : values.makerAsset;
            const takerAddress = values.takerAsset === weth.address ? kyberEth : values.takerAsset;
            resolve(
              (await contract.getExpectedRate(makerAddress, takerAddress, new BigNumber(toWei(values.makerQuantity))))
                .expectedRate
            );
          } catch (e) {
            resolve(new BigNumber(0));
          }
        });

        return fromWei(expected.toString());
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
    const qty = new BigNumber(makerQuantity ?? 0).multipliedBy(price);
    form.setValue('takerQuantity', !qty.isZero() ? qty.toString() : '');
  }, [price.toString(), makerQuantity]);

  const submit = form.handleSubmit(async data => {
    const hub = new Hub(environment, props.address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);
    const adapter = await KyberTradingAdapter.create(trading, props.exchange.exchange);

    const tx = adapter.takeOrder(account.address!, {
      makerAsset: data.makerAsset!,
      takerAsset: data.takerAsset!,
      makerQuantity: new BigNumber(toWei(`${data.makerQuantity!}`)),
      takerQuantity: new BigNumber(toWei(`${data.takerQuantity!}`)),
    });

    transaction.start(tx, 'Take order');
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    changes$.next([event.target.name, event.target.value]);

  return (
    <>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <FormField name="makerAsset" label="Buy">
            <Dropdown name="makerAsset" options={options} onChange={handleChange} disabled={loading} />
          </FormField>

          <FormField name="makerQuantity">
            <Input type="number" step="any" name="makerQuantity" onChange={handleChange} />
          </FormField>

          <FormField name="takerAsset" label="Sell">
            <Dropdown name="takerAsset" options={options} onChange={handleChange} disabled={loading} />
          </FormField>

          <FormField name="takerQuantity">
            <Input type="number" step="any" name="takerQuantity" disabled={true} />
          </FormField>

          {!loading && (
            <div>
              1 {makerAsset?.symbol ?? 'N/A'} = {price} {takerAsset?.symbol ?? 'N/A'}
            </div>
          )}
          {loading && <Spinner />}

          <Button type="submit" disabled={loading}>
            Submit
          </Button>
        </form>
      </FormContext>
      <TransactionModal transaction={transaction} />
    </>
  );
};
