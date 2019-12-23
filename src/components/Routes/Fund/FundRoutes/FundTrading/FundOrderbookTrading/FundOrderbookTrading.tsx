import React from 'react';
import useForm, { FormContext } from 'react-hook-form';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Trading, Hub, OasisDexTradingAdapter } from '@melonproject/melonjs';
import { findExchange } from '~/utils/findExchange';
import { findToken } from '~/utils/findToken';
import BigNumber from 'bignumber.js';
import { InputField } from '~/components/Common/Form/InputField/InputField';
import { refetchQueries } from '~/utils/refetchQueries';
import { useOnChainClient } from '~/hooks/useQuery';

export interface FundOrderbookTradingProps {
  address: string;
}

export const FundOrderbookTrading: React.FC<FundOrderbookTradingProps> = props => {
  const environment = useEnvironment()!;
  const client = useOnChainClient()!;
  const transaction = useTransaction(environment, {
    onFinish: () => refetchQueries(client),
  });

  const form = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      exchange: '0xeeb647323dCcfA322007b865669a3Fbe3bb246c0',
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

    if (exchange && exchange.name === 'MatchingMarket') {
      const adapter = await OasisDexTradingAdapter.create(trading, exchange.exchange);
      const tx = adapter.makeOrder(environment.account!, {
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
        <InputField type="text" name="exchange" label="Exchange" />
        <InputField type="text" name="makerAsset" label="Maker asset" />
        <InputField type="text" name="takerAsset" label="Taker asset" />
        <SubmitButton label="asd" onClick={submit} />
      </FormContext>
      <TransactionModal transaction={transaction} />
    </>
  );
};
