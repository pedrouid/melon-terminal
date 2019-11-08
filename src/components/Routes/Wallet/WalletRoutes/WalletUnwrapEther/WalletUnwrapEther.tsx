import React, { useContext } from 'react';
import * as Yup from 'yup';
import BigNumber from 'bignumber.js';
import useForm, { FormContext } from 'react-hook-form';
import { toWei } from 'web3-utils';
import { Weth } from '@melonproject/melonjs';
import { findToken } from '~/utils/findToken';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { refetchQueries } from '~/utils/refetchQueries';
import { WrapEtherForm } from '~/components/Common/Form/WrapEtherForm';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useOnChainClient } from '~/hooks/useQuery';

const validationSchema = Yup.object().shape({
  quantity: Yup.mixed<number>(),
});

const defaultValues = {
  quantity: '0.5',
};

export const WalletUnwrapEther: React.FC = () => {
  const environment = useEnvironment()!;
  const client = useOnChainClient();
  const transaction = useTransaction(environment!, {
    onFinish: () => refetchQueries(client, ['AccountBalancesQuery', 'ConnectionQuery']),
  });

  const form = useForm<typeof defaultValues>({
    defaultValues,
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const submit = form.handleSubmit(async data => {
    const token = findToken(environment.deployment, 'WETH')!;
    const weth = new Weth(environment, token.address);
    const tx = weth.withdraw(new BigNumber(toWei(data.quantity)), environment.account!);
    transaction.start(tx);
  });

  return (
    <div>
      <FormContext {...form}>
        <WrapEtherForm submit={submit} form={form} label="unwrap" />
      </FormContext>

      <FormContext {...transaction.form}>
        <TransactionModal transaction={transaction} title="Unwrap Ether" />
      </FormContext>
    </div>
  );
};

export default WalletUnwrapEther;
