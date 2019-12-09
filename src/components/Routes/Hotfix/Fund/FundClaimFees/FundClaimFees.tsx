import React, { FormEvent } from 'react';
import * as S from './FundClaimFees.styles';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { Accounting, FeeManager } from '@melonproject/melonjs';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useFundDetailsQuery } from '~/queries/FundDetails';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { refetchQueries } from '~/utils/refetchQueries';
import { useOnChainClient } from '~/hooks/useQuery';

export interface ClaimFeesProps {
  address: string;
}

export const FundClaimFees: React.FC<ClaimFeesProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const [details, query] = useFundDetailsQuery(address);
  const client = useOnChainClient();

  const accountingAddress = details && details.routes && details.routes.accounting && details.routes.accounting.address;
  const accounting = new Accounting(environment, accountingAddress);

  const feeManagerInfo = details && details.routes && details.routes.feeManager;
  const feeManagerAddress = feeManagerInfo && feeManagerInfo.address;
  const feeManager = new FeeManager(environment, feeManagerAddress);

  const transaction = useTransaction(environment, {
    onFinish: () => refetchQueries(client),
  });

  const submitAllFees = (event: FormEvent) => {
    event.preventDefault();

    const tx = accounting.triggerRewardAllFees(environment.account!);
    transaction.start(tx);
  };

  const submitManagementFees = (event: FormEvent) => {
    event.preventDefault();

    const tx = feeManager.rewardManagementFee(environment.account!);
    transaction.start(tx);
  };

  if (query.loading) {
    return (
      <S.Wrapper>
        <S.Title>Claim fees</S.Title>
        <Spinner positioning="centered" />
      </S.Wrapper>
    );
  }

  return (
    <S.Wrapper>
      <S.Title>Claim fees</S.Title>
      {query.loading && <Spinner />}

      <p>Claim management fees and performance fees for the fund.</p>
      <p>Accrued management fee: {feeManagerInfo && feeManagerInfo.managementFeeAmount.dividedBy('1e18').toFixed(6)}</p>
      <p>
        Accrued performance fee: {feeManagerInfo && feeManagerInfo.performanceFeeAmount.dividedBy('1e18').toFixed(6)}
      </p>
      <p>
        Payout of performance fee possible:{' '}
        {feeManagerInfo && feeManagerInfo.performanceFee && feeManagerInfo.performanceFee.canUpdate}
      </p>

      <form onSubmit={submitAllFees}>
        <SubmitButton label="Claim all fees" />
      </form>

      <form onSubmit={submitManagementFees}>
        <SubmitButton label="Claim management fees" />
      </form>

      <TransactionModal transaction={transaction} title="Claim fees" />
    </S.Wrapper>
  );
};
