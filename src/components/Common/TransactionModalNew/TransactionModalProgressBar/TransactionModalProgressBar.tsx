import React, { useMemo } from 'react';
import { TransactionProgress, TransactionState } from '~/hooks/useTransactionNew';
import { ProgressBarStep } from '../../ProgressBar/ProgressBarStep/ProgressBarStep';
import { ProgressBar } from '../../ProgressBar/ProgressBar';

export interface TransactionModalProgressBarProps {
  transaction: TransactionState;
}

export const TransactionModalProgressBar: React.FC<TransactionModalProgressBarProps> = props => {
  const step = useMemo(() => {
    if (props.transaction.progress == null) {
      return 0;
    }

    if (props.transaction.progress >= TransactionProgress.EXECUTION_FINISHED) {
      return 3;
    }

    if (props.transaction.progress >= TransactionProgress.EXECUTION_RECEIVED) {
      return 2;
    }

    if (props.transaction.progress >= TransactionProgress.PREPARATION_FINISHED) {
      return 1;
    }

    return 0;
  }, [props.transaction.progress]);

  const loading = useMemo(() => {
    if (props.transaction.progress == null) {
      return false;
    }

    const loading = [
      TransactionProgress.PREPARATION_PENDING,
      TransactionProgress.EXECUTION_PENDING,
      TransactionProgress.EXECUTION_RECEIVED,
    ];

    if (!props.transaction.error && loading.includes(props.transaction.progress)) {
      return true;
    }

    return false;
  }, [props.transaction.error, props.transaction.progress]);

  return (
    <ProgressBar step={step} loading={loading}>
      <ProgressBarStep />
      <ProgressBarStep />
      <ProgressBarStep />
      <ProgressBarStep />
    </ProgressBar>
  );
};
