import React from 'react';
import useForm, { FormContext } from 'react-hook-form';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { Participation } from '@melonproject/melonjs';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { Account } from '~/graphql/types';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import * as S from './ExecuteRequest.styles';

export interface ExecuteRequestProps {
  address: string;
  account: Account;
}

export const ExecuteRequest: React.FC<ExecuteRequestProps> = props => {
  const environment = useEnvironment()!;
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment, {
    onAcknowledge: () => refetch(),
  });

  const form = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const submit = form.handleSubmit(() => {
    const contract = new Participation(environment, props.account.participation!.address!);
    const tx = contract.executeRequestFor(environment.account!, environment.account!);
    transaction.start(tx, 'Execute investment request');
  });

  return (
    <>
      <FormContext {...form}>
        <S.ExecuteRequestForm onSubmit={submit}>
          <SubmitButton label="Execute investment request" id="action" />
        </S.ExecuteRequestForm>
      </FormContext>
      <TransactionModal transaction={transaction} />
    </>
  );
};

export default ExecuteRequest;
