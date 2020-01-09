import React, { useEffect, useRef } from 'react';
import BigNumber from 'bignumber.js';
import * as Yup from 'yup';
import useForm, { FormContext } from 'react-hook-form';
import { TokenDefinition, MelonEngineTradingAdapter, Trading, Hub, ExchangeDefinition } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { FormField } from '~/storybook/components/FormField/FormField';
import { Input } from '~/storybook/components/Input/Input';
import { Button } from '~/storybook/components/Button/Button';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { useAccount } from '~/hooks/useAccount';
import { useTransaction } from '~/hooks/useTransaction';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useMelonEngineTradingQuery } from './FundMelonEngineTrading.query';
import { Block } from '~/storybook/components/Block/Block';

export interface FundMelonEngineTradingProps {
  address: string;
  exchange: ExchangeDefinition;
  asset?: TokenDefinition;
}

interface FundMelonEngineTradingFormValues {
  takerQuantity: string;
  makerQuantity: string;
}

export const FundMelonEngineTrading: React.FC<FundMelonEngineTradingProps> = props => {
  const environment = useEnvironment()!;
  const account = useAccount()!;
  const refetch = useOnChainQueryRefetcher();
  const weth = environment.getToken('WETH')!;
  const mln = environment.getToken('MLN')!;
  const [price, liquid, query] = useMelonEngineTradingQuery(props.address);

  const defaultValues = {
    takerQuantity: '',
    makerQuantity: '',
  };

  // TODO: Solve this in a nicer way with validation context.
  const liquidRef = useRef(liquid);
  useEffect(() => {
    liquidRef.current = liquid;
  }, [liquid]);

  const form = useForm<FundMelonEngineTradingFormValues>({
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    validationSchema: Yup.object().shape({
      takerQuantity: Yup.string()
        .required()
        .test('positive-number', 'Value must be a positive number.', value => {
          const number = new BigNumber(value);
          return !number.isNaN() && !number.isZero() && number.isPositive() && number.isFinite();
        }),
      makerQuantity: Yup.string()
        .required()
        .test('liquid-ether-exceeded', 'Liquid ether balance exceeded.', value => {
          return liquidRef.current.dividedBy(new BigNumber(10).exponentiatedBy(weth.decimals)).isGreaterThan(value);
        })
        .test('positive-number', 'Value must be a positive number.', value => {
          const number = new BigNumber(value);
          return !number.isNaN() && !number.isZero() && number.isPositive() && number.isFinite();
        }),
    }),
  });

  const transaction = useTransaction(environment, {
    onFinish: () => refetch(),
    onAcknowledge: () => form.reset(defaultValues),
  });

  const takerQuantity = form.watch('takerQuantity');

  useEffect(() => {
    const makerQuantity = price.multipliedBy(takerQuantity);
    form.setValue('makerQuantity', !makerQuantity.isNaN() ? makerQuantity.toString() : '');
  }, [takerQuantity, price.toString()]);

  const submit = form.handleSubmit(async data => {
    const hub = new Hub(environment, props.address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);
    const adapter = await MelonEngineTradingAdapter.create(trading, props.exchange.exchange);

    const tx = adapter.takeOrder(account.address!, {
      makerAsset: weth.address,
      takerAsset: mln.address,
      makerQuantity: new BigNumber(data.makerQuantity)
        .multipliedBy(price)
        .multipliedBy(new BigNumber(10).exponentiatedBy(weth.decimals)),
      takerQuantity: new BigNumber(data.takerQuantity).multipliedBy(new BigNumber(10).exponentiatedBy(mln.decimals)),
    });

    transaction.start(tx, 'Take order');
  });

  if (query.loading) {
    return (
      <Block>
        <Spinner />
      </Block>
    );
  }

  return (
    <>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <FormField name="takerQuantity" label="MLN">
            <Input type="text" name="takerQuantity" />
          </FormField>

          <FormField name="makerQuantity" label="WETH">
            <Input type="text" name="makerQuantity" disabled={true} />
          </FormField>

          <div>1 MLN = {price.toFixed(4)} WETH</div>
          <div>{liquid.toFixed(4)} WETH available</div>

          <Button type="submit">Submit</Button>
        </form>
      </FormContext>
      <TransactionModal transaction={transaction} />
    </>
  );
};
