import React from 'react';
import * as S from './CancelRequest.styles';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import useForm, { FormContext } from 'react-hook-form';
import { Participation } from '@melonproject/melonjs';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { AccountParticipation, AccountShares } from '~/queries/FundInvest';

export interface CancelRequestProps {
  address: string;
  account: {
    participation: AccountParticipation;
    shares: AccountShares;
  };
  fundQuery: any;
}

export const CancelRequest: React.FC<CancelRequestProps> = props => {
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
    const tx = participationContract.cancelRequest(environment.account!);
    transaction.start(tx, 'Cancel investment request');
  });

  return (
    <>
      <FormContext {...form}>
        <S.CancelInvestmentForm onSubmit={submit}>
          <SubmitButton label="Cancel investment request" id="action" />
        </S.CancelInvestmentForm>
      </FormContext>
      <TransactionModal transaction={transaction} />
    </>
  );
};

export default CancelRequest;
