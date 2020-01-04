import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { Participation } from '@melonproject/melonjs';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Account } from '@melonproject/melongql';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { useAccount } from '~/hooks/useAccount';
import { Button } from '~/storybook/components/Button/Button';

export interface ExecuteRequestProps {
  address: string;
  account: Account;
  loading: boolean;
}

export const ExecuteRequest: React.FC<ExecuteRequestProps> = props => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment, {
    onFinish: () => refetch(),
  });

  const execute = () => {
    const contract = new Participation(environment, props.account.participation!.address!);
    const tx = contract.executeRequestFor(account.address!, account.address!);
    transaction.start(tx, 'Execute investment request');
  };

  return (
    <>
      <Button type="button" disabled={props.loading} onClick={() => execute()}>Execute investment request</Button>
      <TransactionModal transaction={transaction} />
    </>
  );
};

export default ExecuteRequest;
