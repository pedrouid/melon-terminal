import React, { useState, useMemo, useEffect } from 'react';
import { Version } from '@melonproject/melonjs';
import { TransactionModal } from '~/components/Common/TransactionModalNew/TransactionModal';
import { useTransaction, TransactionHookValues, TransactionProgress } from '~/hooks/useTransactionNew';
import { useEnvironment } from '~/hooks/useEnvironment';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { useFundSetupStateQuery } from './FundSetup.query';
import { useFund } from '~/hooks/useFund';
import { SetupProgressEnum } from '~/graphql/types';
import * as S from './FundSetup.styles';

interface TransactionPipelineOptions<T = any | undefined, S = any | undefined> {
  transactions: TransactionPipelineItem<T, S>[];
  state?: S;
}

interface TransactionPipelineItem<T = any | undefined, S = any | undefined> {
  name: string;
  transaction: TransactionHookValues<T>;
  skip?: (values?: T, state?: S) => boolean;
}

interface TransactionPipelineState<T = any | undefined, S = any | undefined> {
  current?: TransactionPipelineItem<T, S>;
  next?: TransactionPipelineItem<T, S>;
  start?: (parameters?: T) => void;
  continue?: () => void;
}

function useTransactionPipeline<T = any | undefined, S = any | undefined>(
  options: TransactionPipelineOptions<T, S>
): TransactionPipelineState<T, S> {
  const [parameters, setParameters] = useState<T>();
  const current = options.transactions
    .slice()
    .reverse()
    .find(transaction => {
      const progress = transaction.transaction.state.progress;
      return progress != null;
    });

  const next = (() => {
    if (current && current.transaction.state !== TransactionProgress.EXECUTION_FINISHED) {
      return undefined;
    }

    const start = current != null ? options.transactions.indexOf(current) : 0;
    const remaining = options.transactions.slice(start);
    return remaining.find(transaction => {
      if (transaction.skip && transaction.skip(parameters, options.state)) {
        return false;
      }

      return true;
    });
  })();

  const state = {
    current,
    next,
    ...(next &&
      !current && {
        start: (parameters?: T) => {
          setParameters(parameters);
          next.transaction.initialize(parameters);
        },
      }),
    ...(next &&
      current && {
        continue: () => {
          next.transaction.initialize(parameters);
        },
      }),
  };

  return state;
}

export const FundSetup: React.FC = () => {
  const environment = useEnvironment()!;
  const fund = useFund();
  const version = environment.deployment.melon.addr.Version;
  const [progress] = useFundSetupStateQuery(fund.address);

  console.log(progress);
  const pipeline = useTransactionPipeline({
    state: progress,
    transactions: [
      {
        name: 'Create accounting contract',
        skip: () => progress.progress !== SetupProgressEnum.BEGIN,
        transaction: useTransaction(() => {
          const factory = new Version(environment, version);
          return factory.createAccounting(environment.account!);
        }),
      },
      {
        name: 'Create fee manager contract',
        skip: () => progress.progress !== SetupProgressEnum.ACCOUNTING,
        transaction: useTransaction(() => {
          const factory = new Version(environment, version);
          return factory.createFeeManager(environment.account!);
        }),
      },
      {
        name: 'Create participation contract',
        skip: () => progress.progress !== SetupProgressEnum.FEE_MANAGER,
        transaction: useTransaction(() => {
          const factory = new Version(environment, version);
          return factory.createParticipation(environment.account!);
        }),
      },
      {
        name: 'Create policy manager contract',
        skip: () => progress.progress !== SetupProgressEnum.PARTICIPATION,
        transaction: useTransaction(() => {
          const factory = new Version(environment, version);
          return factory.createPolicyManager(environment.account!);
        }),
      },
      {
        name: 'Create shares contract',
        skip: () => progress.progress !== SetupProgressEnum.POLICY_MANAGER,
        transaction: useTransaction(() => {
          const factory = new Version(environment, version);
          return factory.createShares(environment.account!);
        }),
      },
      {
        name: 'Create trading contract',
        skip: () => progress.progress !== SetupProgressEnum.SHARES,
        transaction: useTransaction(() => {
          const factory = new Version(environment, version);
          return factory.createTrading(environment.account!);
        }),
      },
      {
        name: 'Create vault contract',
        skip: () => progress.progress !== SetupProgressEnum.TRADING,
        transaction: useTransaction(() => {
          const factory = new Version(environment, version);
          return factory.createVault(environment.account!);
        }),
      },
      {
        name: 'Complete setup',
        skip: () => progress.progress !== SetupProgressEnum.VAULT,
        transaction: useTransaction(() => {
          const factory = new Version(environment, version);
          return factory.completeSetup(environment.account!);
        }),
      },
    ],
  });

  const submit = () => {
    pipeline.continue && pipeline.continue();
    pipeline.start && pipeline.start();
  };

  return (
    <S.FundSetupBody>
      {pipeline.next && <SubmitButton type="button" onClick={submit} label={pipeline.next?.name} />}
      {pipeline.current && (
        <TransactionModal transaction={pipeline.current.transaction} label={pipeline.current.name} />
      )}
    </S.FundSetupBody>
  );
};

export default FundSetup;
