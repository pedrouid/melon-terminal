import React, { useEffect, useRef } from 'react';
import BigNumber from 'bignumber.js';
import * as Yup from 'yup';
import { useForm, FormContext } from 'react-hook-form';
import {
  TokenDefinition,
  MelonEngineTradingAdapter,
  Trading,
  Hub,
  ExchangeDefinition,
  sameAddress,
} from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Input } from '~/storybook/components/Input/Input';
import { Button } from '~/storybook/components/Button/Button';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { useAccount } from '~/hooks/useAccount';
import { useTransaction } from '~/hooks/useTransaction';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useMelonEngineTradingQuery } from './FundMelonEngineTrading.query';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { BlockActions } from '~/storybook/components/Block/Block';
import { useFundHoldingsQuery } from '~/queries/FundHoldings';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { Holding } from '@melonproject/melongql';

export interface FundMelonEngineTradingProps {
  address: string;
  exchange: ExchangeDefinition;
  holdings: Holding[];
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
  const [price, liquid, query] = useMelonEngineTradingQuery();

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
          return fromTokenBaseUnit(liquidRef.current, weth.decimals).isGreaterThan(value);
        })
        .test('positive-number', 'Value must be a positive number.', value => {
          const number = new BigNumber(value);
          return !number.isNaN() && !number.isZero() && number.isPositive() && number.isFinite();
        }),
    }),
  });

  const transaction = useTransaction(environment, {
    onFinish: receipt => refetch(receipt.blockNumber),
    onAcknowledge: () => form.reset(defaultValues),
  });

  const takerQuantity = form.watch('takerQuantity');

  useEffect(() => {
    const makerQuantity = price.multipliedBy(takerQuantity);
    form.setValue('makerQuantity', !makerQuantity.isNaN() ? makerQuantity.toString() : '');
  }, [takerQuantity, price.toString()]);

  const [holdings, _] = useFundHoldingsQuery(props.address);
  const mlnHolding = holdings.find(holding => sameAddress(holding.token?.address, mln.address));
  const mlnHoldingAmount = mlnHolding?.amount || new BigNumber(0);

  useEffect(() => {
    if (mlnHoldingAmount.isLessThan(toTokenBaseUnit(takerQuantity, mln.decimals))) {
      form.setError('takerQuantity', 'tooLow', `Your ${mln.symbol} balance is too low`);
    } else {
      form.clearError('takerQuantity');
    }
  }, [mlnHoldingAmount, takerQuantity]);

  const submit = form.handleSubmit(async data => {
    const hub = new Hub(environment, props.address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);
    const adapter = await MelonEngineTradingAdapter.create(trading, props.exchange.exchange);

    const tx = adapter.takeOrder(account.address!, {
      makerAsset: weth.address,
      takerAsset: mln.address,
      makerQuantity: toTokenBaseUnit(data.makerQuantity, weth.decimals).multipliedBy(price),
      takerQuantity: toTokenBaseUnit(data.takerQuantity, mln.decimals),
    });

    transaction.start(tx, 'Take order');
  });

  if (query.loading) {
    return <Spinner />;
  }

  return (
    <>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <Input type="text" label="MLN" name="takerQuantity" />
          <Input type="text" label="WETH" name="makerQuantity" disabled={true} />

          <div>1 MLN = {price.toFixed(4)} WETH</div>
          <div>
            <FormattedNumber value={liquid} suffix="WETH available" />
          </div>

          <BlockActions>
            <Button type="submit">Submit</Button>
          </BlockActions>
        </form>
      </FormContext>
      <TransactionModal transaction={transaction} />
    </>
  );
};
