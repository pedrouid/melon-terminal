import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { useHistory } from 'react-router';
import { Accounting, FeeManager } from '@melonproject/melonjs';
import { Button } from '~/storybook/components/Button/Button';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useFundDetailsQuery } from '~/queries/FundDetails';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { useAccount } from '~/hooks/useAccount';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { Block, BlockActions } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { DictionaryData, DictionaryEntry, DictionaryLabel } from '~/storybook/components/Dictionary/Dictionary';

export interface ClaimFeesProps {
  address: string;
}

export const ClaimFees: React.FC<ClaimFeesProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const history = useHistory();
  const refetch = useOnChainQueryRefetcher();
  const [details, query] = useFundDetailsQuery(address);

  const accountingAddress = details && details.routes && details.routes.accounting && details.routes.accounting.address;
  const accounting = new Accounting(environment, accountingAddress);
  const feeManagerInfo = details && details.routes && details.routes.feeManager;
  const feeManagerAddress = feeManagerInfo && feeManagerInfo.address;
  const feeManager = new FeeManager(environment, feeManagerAddress);

  const transaction = useTransaction(environment, {
    onFinish: () => refetch(),
    onAcknowledge: () => {
      history.push(`/fund/${address}`);
    },
  });

  const submitAllFees = () => {
    const tx = accounting.triggerRewardAllFees(account.address!);
    transaction.start(tx, 'Claim all fees');
  };

  const submitManagementFees = () => {
    const tx = feeManager.rewardManagementFee(account.address!);
    transaction.start(tx, 'Claim management fee');
  };

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Claim fees</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Claim fees</SectionTitle>

      <p>Claim management fees and performance fees for the fund.</p>

      <DictionaryEntry>
        <DictionaryLabel>Accrued management fee</DictionaryLabel>
        <DictionaryData>{feeManagerInfo?.managementFeeAmount.dividedBy('1e18').toFixed(6)}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Accrued performance fee</DictionaryLabel>
        <DictionaryData>{feeManagerInfo?.performanceFeeAmount.dividedBy('1e18').toFixed(6)}</DictionaryData>
      </DictionaryEntry>

      <BlockActions>
        <Button type="submit" onClick={() => submitAllFees()} disabled={!feeManagerInfo?.performanceFee?.canUpdate}>
          Claim all fees
        </Button>
        <Button type="submit" onClick={() => submitManagementFees()}>
          Claim management fees
        </Button>
      </BlockActions>

      <TransactionModal transaction={transaction} />
    </Block>
  );
};

export default ClaimFees;
