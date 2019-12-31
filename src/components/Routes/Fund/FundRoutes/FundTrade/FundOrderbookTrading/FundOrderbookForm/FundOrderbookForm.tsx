import React from 'react';
import useForm, { FormContext } from 'react-hook-form';
import BigNumber from 'bignumber.js';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Trading, Hub, OasisDexTradingAdapter, findToken, findExchange } from '@melonproject/melonjs';
import { InputField } from '~/components/Common/Form/InputField/InputField';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { useAccount } from '~/hooks/useAccount';

export interface FundOrderbookFormProps {
  address: string;
}

export const FundOrderbookForm: React.FC<FundOrderbookFormProps> = props => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment, {
    onFinish: () => refetch(),
  });

  const form = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      exchange: findExchange(environment.deployment!, 'OasisDex')?.exchange,
      makerAsset: 'WETH',
      takerAsset: 'MLN',
    },
  });

  const submit = form.handleSubmit(async data => {
    const makerAsset = findToken(environment.deployment!, data.makerAsset)!;
    const takerAsset = findToken(environment.deployment!, data.takerAsset)!;
    const exchange = findExchange(environment.deployment, data.exchange);

    const hub = new Hub(environment, props.address);
    const trading = new Trading(environment, (await hub.getRoutes()).trading);

    if (exchange && exchange.name === 'OasisDex') {
      const adapter = await OasisDexTradingAdapter.create(trading, exchange.exchange);
      const tx = adapter.makeOrder(account.address!, {
        makerAsset: makerAsset.address,
        takerAsset: takerAsset.address,
        makerQuantity: new BigNumber(10).exponentiatedBy(makerAsset.decimals).multipliedBy(1),
        takerQuantity: new BigNumber(10).exponentiatedBy(takerAsset.decimals).multipliedBy(1),
      });

      transaction.start(tx, 'Make order');
    }
  });

  return (
    <>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <InputField type="text" name="exchange" label="Exchange" />
          <InputField type="text" name="makerAsset" label="Maker asset" />
          <InputField type="text" name="takerAsset" label="Taker asset" />
          <SubmitButton label="asd" />
        </form>
      </FormContext>
      <TransactionModal transaction={transaction} />
    </>
  );
};
