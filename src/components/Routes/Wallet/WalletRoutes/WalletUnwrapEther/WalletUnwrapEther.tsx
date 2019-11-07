import React, { useContext } from 'react';
import * as Yup from 'yup';
import BigNumber from 'bignumber.js';
import useForm, { FormContext } from 'react-hook-form';
import { toWei } from 'web3-utils';
import { Weth } from '@melonproject/melonjs';
import { findToken } from '~/utils/findToken';
import { useTransaction } from '~/hooks/useTransaction';
import { OnChainContext } from '~/components/Contexts/Connection';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { refetchQueries } from '~/utils/refetchQueries';
import { WrapEtherForm } from '~/components/Common/Form/WrapEtherForm';

const validationSchema = Yup.object().shape({
  quantity: Yup.mixed<number>(),
});

const defaultValues = {
  quantity: '0.5',
};

export const WalletUnwrapEther: React.FC = () => {
  const chain = useContext(OnChainContext);
  const transaction = useTransaction(chain.environment!, {
    onFinish: () => refetchQueries(chain.client, ['AccountBalancesQuery', 'ConnectionQuery']),
  });

  const form = useForm<typeof defaultValues>({
    defaultValues,
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const submit = form.handleSubmit(async data => {
    const token = findToken(chain.environment!.deployment!, 'WETH')!;
    const weth = new Weth(chain.environment!, token.address);
    const tx = weth.withdraw(new BigNumber(toWei(data.quantity)), chain.environment!.account!);
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
