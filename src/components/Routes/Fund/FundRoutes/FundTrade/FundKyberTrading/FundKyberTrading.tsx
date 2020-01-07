import React, { useMemo, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import * as Yup from 'yup';
import * as Rx from 'rxjs';
import useForm, { FormContext } from 'react-hook-form';
import { TokenDefinition, KyberNetworkProxy } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { FormField } from '~/storybook/components/FormField/FormField';
import { Input } from '~/storybook/components/Input/Input';
import { Button } from '~/storybook/components/Button/Button';
import * as S from './FundKyberTrading.styles';
import { startWith, scan, distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { equals } from 'ramda';

export interface FundKyberTradingProps {
  address: string;
  asset?: TokenDefinition;
}

const validationSchema = Yup.object().shape({
  makerAsset: Yup.string()
    .required(),
  takerAsset: Yup.string()
    .required(),
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
  takerQuantity?: string;
}

export const FundKyberTrading: React.FC<FundKyberTradingProps> = props => {
  const environment = useEnvironment()!;
  const options = environment.tokens.map(token => ({
    value: token.address,
    name: token.symbol,
  }));

  const defaultValues = {
    makerAsset: options[0].value,
    takerAsset: options[1].value,
    makerQuantity: '1',
  };

  const form = useForm<FundKyberTradingFormValues>({
    defaultValues,
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const changes$ = useMemo(() => new Rx.Subject<[string, string]>(), []);
  const stream$ = useMemo(() => {
    const contract = new KyberNetworkProxy(environment, environment.deployment.kyber.addr.KyberNetworkProxy);
    const scanned$ = Rx.from(changes$).pipe(scan((carry, [key, value]) => ({ ...carry, [key]: value }), defaultValues));
    const values$ = scanned$.pipe(debounceTime(500), startWith(defaultValues), distinctUntilChanged((a, b) => equals(a, b)));
    return values$.pipe(switchMap(async (values) => {
      const rates = await contract.getExpectedRate(values.makerAsset, values.takerAsset, new BigNumber(values.makerQuantity));

      return {
        price: rates.expectedRate,
        quantity: rates.expectedRate.multipliedBy(values.makerQuantity),
      };
    }));
  }, [changes$]);

  useEffect(() => {
    const subscription = stream$.subscribe({
      next: (value) => {
        form.setValue('takerQuantity', value.quantity.toString());
      }
    });

    return () => subscription.unsubscribe();
  }, [stream$]);

  const submit = form.handleSubmit(async (data) => {
    // TODO: Implement.
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => changes$.next([event.target.name, event.target.value]);

  return (
    <S.FundKyberTrading>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <FormField name="makerAsset" label="From">
            <Dropdown name="makerAsset" options={options} onChange={handleChange} />
          </FormField>

          <FormField name="makerQuantity">
            <Input type="number" step="any" name="makerQuantity" onChange={handleChange} />
          </FormField>

          <FormField name="takerAsset" label="To">
            <Dropdown name="takerAsset" options={options} onChange={handleChange} />
          </FormField>

          <FormField name="takerQuantity">
            <Input type="number" step="any" name="takerQuantity" disabled={true} />
          </FormField>

          <Button type="submit">Submit</Button>
        </form>
      </FormContext>
    </S.FundKyberTrading>
  );
};
