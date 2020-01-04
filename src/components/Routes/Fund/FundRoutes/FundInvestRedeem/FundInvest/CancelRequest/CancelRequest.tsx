import React from 'react';
import { Participation } from '@melonproject/melonjs';
import { Account } from '@melonproject/melongql';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { useAccount } from '~/hooks/useAccount';
import { Button } from '~/storybook/components/Button/Button';

export interface CancelRequestProps {
  address: string;
  account: Account;
  loading: boolean;
}

export const CancelRequest: React.FC<CancelRequestProps> = props => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment, {
    onFinish: () => refetch(),
  });

  const cancel = () => {
    const participationAddress = props.account && props.account.participation && props.account.participation.address;
    const participationContract = new Participation(environment, participationAddress);
    const tx = participationContract.cancelRequest(account.address!);
    transaction.start(tx, 'Cancel investment request');
  };

  return (
    <>
      <Button type="button" id="action" disabled={props.loading} onClick={() => cancel()}>Cancel investment request</Button>
      <TransactionModal transaction={transaction} />
    </>
  );
};

export default CancelRequest;
