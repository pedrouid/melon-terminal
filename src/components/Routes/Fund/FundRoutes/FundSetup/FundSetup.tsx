import React from 'react';
import { Version } from '@melonproject/melonjs';
import { TransactionModal } from '~/components/Common/TransactionModalNew/TransactionModal';
import { useTransaction, TransactionHookValues, TransactionProgress } from '~/hooks/useTransactionNew';
import { useEnvironment } from '~/hooks/useEnvironment';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import * as S from './FundSetup.styles';

interface TransactionPipelineOptions<T = any | undefined> {
  transactions: TransactionPipelineItem<T>[];
}

interface TransactionPipelineItem<T = any | undefined> {
  name: string;
  transaction: TransactionHookValues<T>;
}

interface TransactionPipelineState<T = any | undefined> {
  current?: TransactionPipelineItem<T>;
}

function useTransactionPipeline<T = any | undefined>(options: TransactionPipelineOptions<T>): TransactionPipelineState<T> {
  const item = options.transactions.reduce((carry, current) => {
    const progress = carry.transaction.state.progress;
    if (progress === TransactionProgress.EXECUTION_FINISHED) {
      return current;
    }

    return carry;
  }, options.transactions[0]);

  const state = {
    current: item,
  };

  return state;
}

export const FundSetup: React.FC = () => {
  const environment = useEnvironment()!;
  const version = environment.deployment.melon.addr.Version;
  const pipeline = useTransactionPipeline({
    transactions: [
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
      },
    ],
  });

  return (
    <S.FundSetupBody>
      <SubmitButton type="button" onClick={() => pipeline.current && pipeline.current.transaction.initialize()} label="Test" />
      {pipeline.current && <TransactionModal transaction={pipeline.current.transaction} label={pipeline.current.name} />}
    </S.FundSetupBody>
  );
};

export default FundSetup;
