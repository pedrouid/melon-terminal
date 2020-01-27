import React, { useState, useEffect } from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { Participation } from '@melonproject/melonjs';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Account } from '@melonproject/melongql';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { useAccount } from '~/hooks/useAccount';
import { Button } from '~/storybook/components/Button/Button';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { BigNumber } from 'bignumber.js';

export interface ExecuteRequestProps {
  address: string;
  account: Account;
  loading: boolean;
  totalSupply?: BigNumber;
}

export const ExecuteRequest: React.FC<ExecuteRequestProps> = props => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();
  const [refetching, setRefetching] = useState(false);

  const transaction = useTransaction(environment, {
    onAcknowledge: receipt => {
      setRefetching(true);
      refetch(receipt.blockNumber);
    },
  });

  const execute = () => {
    const contract = new Participation(environment, props.account.participation!.address!);
    const tx = contract.executeRequestFor(account.address!, account.address!);
    transaction.start(tx, 'Execute investment request');
  };

  useEffect(() => {
    if (props.totalSupply?.isZero()) {
      execute();
    }
  }, []);

  if (refetching) {
    return <Spinner></Spinner>;
  }

  return (
    <>
      <Button type="button" disabled={props.loading} onClick={() => execute()}>
        Execute investment request
      </Button>
      <TransactionModal transaction={transaction} />
    </>
  );
};

export default ExecuteRequest;
