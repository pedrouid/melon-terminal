import React, { forwardRef, useImperativeHandle } from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { TransactionHookValues, TransactionFormValues } from '~/hooks/useTransaction';
import { Participation, Transaction } from '@melonproject/melonjs';
import { Account } from '@melonproject/melongql';
import { useAccount } from '~/hooks/useAccount';
import { Button } from '~/storybook/components/Button/Button';
import { BigNumber } from 'bignumber.js';
import { TransactionRef } from '../FundInvest';

export interface ExecuteRequestProps {
  address: string;
  account: Account;
  loading: boolean;
  totalSupply?: BigNumber;
  transaction: TransactionHookValues<TransactionFormValues>;
}

export const ExecuteRequest = forwardRef((props: ExecuteRequestProps, ref: React.Ref<TransactionRef | undefined>) => {
  const environment = useEnvironment()!;
  const account = useAccount();

  const execute = () => {
    const contract = new Participation(environment, props.account.participation!.address!);
    const tx = contract.executeRequestFor(account.address!, account.address!);
    props.transaction.start(tx, 'Execute investment request');
  };

  useImperativeHandle(ref, () => ({
    next: (start: (transaction: Transaction, name: string) => void) => {
      if (props.totalSupply?.isZero()) {
        const contract = new Participation(environment, props.account.participation!.address!);
        const tx = contract.executeRequestFor(account.address!, account.address!);
        props.transaction.start(tx, 'Execute investment request');
      }
    },
  }));

  return (
    <Button type="button" disabled={props.loading} onClick={() => execute()}>
      Execute investment request
    </Button>
  );
});
