import React, { FormEvent } from 'react';
import * as S from './FundClaimFees.styles';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { useHistory } from 'react-router';
import { ButtonBlock } from '~/components/Common/Form/ButtonBlock/ButtonBlock';
import { Accounting, FeeManager } from '@melonproject/melonjs';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useFundDetailsQuery } from '~/queries/FundDetails';

export interface ClaimFeesProps {
  address: string;
}

export const ClaimFees: React.FC<ClaimFeesProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const [details, query] = useFundDetailsQuery(address);

  const history = useHistory();

  const accountingAddress = details && details.routes && details.routes.accounting && details.routes.accounting.address;
  const accounting = new Accounting(environment, accountingAddress);

  const feeManagerInfo = details && details.routes && details.routes.feeManager;
  const feeManagerAddress = feeManagerInfo && feeManagerInfo.address;
  const feeManager = new FeeManager(environment, feeManagerAddress);

  const transaction = useTransaction(environment, {
    onFinish: () => {},
    onAcknowledge: () => {
      history.push(`/fund/${address}`);
    },
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

  return (
    <S.FundShutdownBody>
      <h1>Claim fees</h1>
      <p>Claim management fees and performance fees for the fund.</p>

      <p>Accrued management fee: {feeManagerInfo && feeManagerInfo.managementFeeAmount.toString()}</p>
      <p>Accrued performance fee: {feeManagerInfo && feeManagerInfo.performanceFeeAmount.toString()}</p>
      <p>
        Payout of performance fee possible:{' '}
        {feeManagerInfo && feeManagerInfo.performanceFee && feeManagerInfo.performanceFee.canUpdate}
      </p>

      <form onSubmit={submitAllFees}>
        <ButtonBlock>
          <SubmitButton label="Claim all fees" />
        </ButtonBlock>
      </form>

      <form onSubmit={submitManagementFees}>
        <ButtonBlock>
          <SubmitButton label="Claim management fees" />
        </ButtonBlock>
      </form>

      <TransactionModal transaction={transaction} title="Claim fees" />
    </S.FundShutdownBody>
  );
};

export default ClaimFees;
