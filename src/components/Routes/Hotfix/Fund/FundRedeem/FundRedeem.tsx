import React, { FormEvent } from 'react';
import * as S from './FundRedeem.styles';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useFundInvestQuery } from '~/queries/FundInvest';
import { Participation } from '@melonproject/melonjs';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { refetchQueries } from '~/utils/refetchQueries';
import { useOnChainClient } from '~/hooks/useQuery';

export interface RedeemProps {
  address: string;
}

export const FundRedeem: React.FC<RedeemProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const [result, query] = useFundInvestQuery(address);
  const client = useOnChainClient();

  const account = result && result.account;
  const participationAddress = account && account.participation && account.participation.address;
  const ownShares = account && account.shares;
  const hasShares = ownShares && !ownShares.balanceOf.isZero();
  const participationContract = new Participation(environment, participationAddress);

  const transaction = useTransaction(environment, {
    onFinish: () => refetchQueries(client),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const tx = participationContract.redeem(environment.account!);
    transaction.start(tx);
  };

  if (query.loading) {
    return (
      <S.Wrapper>
        <S.Title>Redeem assets</S.Title>
        <Spinner positioning="centered" />
      </S.Wrapper>
    );
  }

  if (!hasShares) {
    return (
      <S.Wrapper>
        <S.Title>Redeem assets</S.Title>
        <div>You don't own any shares in this fund.</div>
      </S.Wrapper>
    );
  }

  return (
    <S.Wrapper>
      <S.Title>Redeem assets</S.Title>
      <p>You own {ownShares!.balanceOf.toString()} shares.</p>
      <form onSubmit={submit}>
        <SubmitButton label="Redeem all shares" id="action" />
      </form>
      <TransactionModal transaction={transaction} title="Redeem shares" />
    </S.Wrapper>
  );
};
