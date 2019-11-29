import React from 'react';
import * as S from './ExecuteRequest.styles';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import useForm, { FormContext } from 'react-hook-form';
import { Participation } from '@melonproject/melonjs';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import {
  AccountParticipation,
  AccountShares,
  FundInvestQueryResult,
  FundInvestQueryVariables,
} from '~/queries/FundInvest';
import { QueryResult } from '@apollo/react-common';

export interface ExecuteRequestProps {
  address: string;
  account: {
    participation: AccountParticipation;
    shares: AccountShares;
  };
  fundQuery: QueryResult<FundInvestQueryResult, FundInvestQueryVariables>;
}

export const ExecuteRequest: React.FC<ExecuteRequestProps> = props => {
  const environment = useEnvironment()!;

  const transaction = useTransaction(environment, {
    onAcknowledge: () => {
      props.fundQuery.refetch();
    },
  });

  const participationAddress = props.account && props.account.participation && props.account.participation.address;
  const participationContract = new Participation(environment, participationAddress);

  const form = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const submit = form.handleSubmit(() => {
    const tx = participationContract.executeRequestFor(environment.account!, environment.account!);
    transaction.start(tx);
  });

  return (
    <>
      <FormContext {...form}>
        <S.ExecuteRequestForm onSubmit={submit}>
          <SubmitButton label="Execute investment request" id="action" />
        </S.ExecuteRequestForm>
      </FormContext>
      <TransactionModal transaction={transaction} title="Execute investment request" />
    </>
  );
};

export default ExecuteRequest;
