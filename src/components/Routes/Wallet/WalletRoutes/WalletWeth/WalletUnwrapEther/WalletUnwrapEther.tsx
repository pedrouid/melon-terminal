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
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';

import { Block } from '~/storybook/components/Block/Block';
import { Title } from '~/storybook/components/Title/Title';

const validationSchema = Yup.object().shape({
  quantity: Yup.mixed<number>(),
});

const defaultValues = {
  quantity: '0.5',
};

export const WalletUnwrapEther: React.FC = () => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment!, {
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
    const tx = weth.withdraw(new BigNumber(toWei(data.quantity)), account.address!);
    transaction.start(tx, 'Unwrap Ether');
  });

  return (
    <Block>
      <Title>Unwrap Ether</Title>
      <FormContext {...form}>
        <WrapEtherForm submit={submit} form={form} label="unwrap" />
      </FormContext>

      <TransactionModal transaction={transaction} />
    </Block>
  );
};

export default WalletUnwrapEther;
