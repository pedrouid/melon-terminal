import React from 'react';
import * as Yup from 'yup';
import BigNumber from 'bignumber.js';
import useForm, { FormContext } from 'react-hook-form';
import { toWei } from 'web3-utils';
import { Weth } from '@melonproject/melonjs';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { WrapEtherForm } from '~/components/Common/Form/WrapEtherForm';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import * as S from './WalletWrapEther.styles';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';

const validationSchema = Yup.object().shape({
  quantity: Yup.number()
    .required()
    .positive(),
});

const defaultValues = {
  quantity: 0.5,
};

export const WalletWrapEther: React.FC = () => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment, {
    onFinish: () => refetch(),
  });

  const form = useForm<typeof defaultValues>({
    defaultValues,
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const submit = form.handleSubmit(async data => {
    const token = environment.getToken('WETH')!;
    const weth = new Weth(environment, token.address);
    const tx = weth.deposit(new BigNumber(toWei(`${data.quantity}`)), account.address!);
    transaction.start(tx, 'Wrap Ether');
  });

  return (
    <S.Wrapper>
      <S.Title>Wrap Ether</S.Title>
      <FormContext {...form}>
        <WrapEtherForm submit={submit} form={form} label="wrap" />
      </FormContext>

      <TransactionModal transaction={transaction} />
    </S.Wrapper>
  );
};

export default WalletWrapEther;
