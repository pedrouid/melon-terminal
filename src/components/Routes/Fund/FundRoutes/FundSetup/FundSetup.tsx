import React from 'react';
import { TransactionModal } from '~/components/Common/TransactionModalNew/TransactionModal';
import { useTransaction, TransactionHookValues, TransactionProgress } from '~/hooks/useTransactionNew';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Version } from '@melonproject/melonjs';
import * as S from './FundSetup.styles';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';

interface TransactionPipelineItem {
  name: string;
  transaction: TransactionHookValues;
}

interface TransactionPipelineState {
  current: TransactionPipelineItem;
}

function useTransactionPipeline(transactions: TransactionPipelineItem[]) {
  if (!transactions.length) {
    throw new Error('You have to pass at least one transaction.');
  }

  const item = transactions.reduce((carry, current) => {
    const progress = carry.transaction.state.progress;
    if (progress === TransactionProgress.EXECUTION_FINISHED) {
      return current;
    }

    return carry;
  }, transactions[0]);

  const state: TransactionPipelineState = {
    current: item,
  };

  return state;
}

export const FundSetup: React.FC = () => {
  const environment = useEnvironment()!;
  const version = environment.deployment.melon.addr.Version;
  const pipeline = useTransactionPipeline([
    {
      name: 'Create accounting contract',
      transaction: useTransaction(() => {
        const factory = new Version(environment, version);
        return factory.createAccounting(environment.account!);
      }),
    },
    {
      name: 'Create fee manager contract',
      transaction: useTransaction(() => {
        const factory = new Version(environment, version);
        return factory.createFeeManager(environment.account!);
      }),
    },
    {
      name: 'Create participation contract',
      transaction: useTransaction(() => {
        const factory = new Version(environment, version);
        return factory.createParticipation(environment.account!);
      }),
    },
    {
      name: 'Create policy manager contract',
      transaction: useTransaction(() => {
        const factory = new Version(environment, version);
        return factory.createPolicyManager(environment.account!);
      }),
    },
    {
      name: 'Create shares contract',
      transaction: useTransaction(() => {
        const factory = new Version(environment, version);
        return factory.createShares(environment.account!);
      }),
    },
    {
      name: 'Create trading contract',
      transaction: useTransaction(() => {
        const factory = new Version(environment, version);
        return factory.createTrading(environment.account!);
      }),
    },
    {
      name: 'Create vault contract',
      transaction: useTransaction(() => {
        const factory = new Version(environment, version);
        return factory.createVault(environment.account!);
      }),
    },
    {
      name: 'Complete setup',
      transaction: useTransaction(() => {
        const factory = new Version(environment, version);
        return factory.completeSetup(environment.account!);
      }),
    }
  ]);

  return (
    <S.FundSetupBody>
      <SubmitButton type="button" onClick={() => pipeline.current.transaction.initialize()} label="Test" />
      <TransactionModal transaction={pipeline.current.transaction} label={pipeline.current.name} />
    </S.FundSetupBody>
  );
};

export default FundSetup;
