import React, { useEffect, useReducer } from 'react';
import * as Yup from 'yup';
import useForm from 'react-hook-form';
import { TransactionReceipt } from 'web3-core';
import { Transaction } from '@melonproject/melonjs';
import { Environment } from '~/environment';
import { FormContextValues } from 'react-hook-form/dist/contextTypes';
import { FieldValues } from 'react-hook-form/dist/types';

export interface TransactionFormValues extends FieldValues {
  gasLimit: string;
  gasPrice: string;
}

export interface TransactionState {
  progress: number;
  gasLimit?: number;
  gasPrice?: string;
  transaction?: Transaction;
  hash?: string;
  receipt?: TransactionReceipt;
  error?: Error;
  loading: boolean;
}

export enum TransactionProgress {
  TRANSACTION_WAITING,
  TRANSACTION_CANCELLED,
  TRANSACTION_STARTED,
  ESTIMATION_ERROR,
  ESTIMATION_PENDING,
  ESTIMATION_FINISHED,
  EXECUTION_ERROR,
  EXECUTION_PENDING,
  EXECUTION_RECEIVED,
  EXECUTION_FINISHED,
  TRANSACTION_ACKNOWLEDGED,
}

type TransactionAction =
  | TransactionStarted
  | TransactionCancelled
  | TransactionAcknowledged
  | EstimationPending
  | EstimationFinished
  | EstimationError
  | ExecutionPending
  | ExecutionReceived
  | ExecutionFinished
  | ExecutionError;

interface TransactionStarted {
  type: TransactionProgress.TRANSACTION_STARTED;
  transaction: Transaction;
}

interface TransactionCancelled {
  type: TransactionProgress.TRANSACTION_CANCELLED;
}

interface TransactionAcknowledged {
  type: TransactionProgress.TRANSACTION_ACKNOWLEDGED;
}

interface EstimationPending {
  type: TransactionProgress.ESTIMATION_PENDING;
}

interface EstimationFinished {
  type: TransactionProgress.ESTIMATION_FINISHED;
  limit: number;
  price: string;
}

interface EstimationError {
  type: TransactionProgress.ESTIMATION_ERROR;
  error: Error;
}

interface ExecutionPending {
  type: TransactionProgress.EXECUTION_PENDING;
}

interface ExecutionReceived {
  type: TransactionProgress.EXECUTION_RECEIVED;
  hash: string;
}

interface ExecutionFinished {
  type: TransactionProgress.EXECUTION_FINISHED;
  receipt: TransactionReceipt;
}

interface ExecutionError {
  type: TransactionProgress.EXECUTION_ERROR;
  error: Error;
}

function reducer(state: TransactionState, action: TransactionAction): TransactionState {
  switch (action.type) {
    case TransactionProgress.TRANSACTION_STARTED:
      return {
        ...state,
        progress: TransactionProgress.TRANSACTION_STARTED,
        transaction: action.transaction,
        error: undefined,
        hash: undefined,
        receipt: undefined,
        gasPrice: undefined,
        gasLimit: undefined,
        loading: true,
      };

    case TransactionProgress.TRANSACTION_CANCELLED:
      return {
        ...state,
        progress: TransactionProgress.TRANSACTION_CANCELLED,
        transaction: undefined,
        error: undefined,
        hash: undefined,
        receipt: undefined,
        gasPrice: undefined,
        gasLimit: undefined,
        loading: false,
      };

    case TransactionProgress.TRANSACTION_ACKNOWLEDGED: {
      return {
        ...state,
        progress: TransactionProgress.TRANSACTION_ACKNOWLEDGED,
      };
    }

    case TransactionProgress.ESTIMATION_PENDING: {
      return {
        ...state,
        progress: TransactionProgress.ESTIMATION_PENDING,
        loading: true,
        error: undefined,
      };
    }

    case TransactionProgress.ESTIMATION_ERROR: {
      return {
        ...state,
        progress: TransactionProgress.ESTIMATION_ERROR,
        loading: false,
        error: action.error,
      };
    }

    case TransactionProgress.ESTIMATION_FINISHED:
      return {
        ...state,
        progress: TransactionProgress.ESTIMATION_FINISHED,
        loading: false,
        gasPrice: action.price,
        gasLimit: action.limit,
      };

    case TransactionProgress.EXECUTION_PENDING: {
      return {
        ...state,
        progress: TransactionProgress.EXECUTION_PENDING,
        loading: true,
        error: undefined,
        hash: undefined,
      };
    }

    case TransactionProgress.EXECUTION_RECEIVED: {
      return {
        ...state,
        progress: TransactionProgress.EXECUTION_RECEIVED,
        hash: action.hash,
      };
    }

    case TransactionProgress.EXECUTION_FINISHED: {
      return {
        ...state,
        progress: TransactionProgress.EXECUTION_FINISHED,
        loading: false,
        receipt: action.receipt,
      };
    }

    case TransactionProgress.EXECUTION_ERROR: {
      return {
        ...state,
        progress: TransactionProgress.EXECUTION_ERROR,
        loading: false,
        error: action.error,
      };
    }

    default:
      throw new Error('Invalid action.');
  }
}

function estimationPending(dispatch: React.Dispatch<TransactionAction>) {
  dispatch({ type: TransactionProgress.ESTIMATION_PENDING });
}

function estimationFinished(dispatch: React.Dispatch<TransactionAction>, price: string, limit: number) {
  dispatch({ limit, price, type: TransactionProgress.ESTIMATION_FINISHED });
}

function estimationError(dispatch: React.Dispatch<TransactionAction>, error: Error) {
  dispatch({ error, type: TransactionProgress.ESTIMATION_ERROR });
}

function executionPending(dispatch: React.Dispatch<TransactionAction>) {
  dispatch({ type: TransactionProgress.EXECUTION_PENDING });
}

function executionReceived(dispatch: React.Dispatch<TransactionAction>, hash: string) {
  dispatch({ hash, type: TransactionProgress.EXECUTION_RECEIVED });
}

function executionFinished(dispatch: React.Dispatch<TransactionAction>, receipt: TransactionReceipt) {
  dispatch({ receipt, type: TransactionProgress.EXECUTION_FINISHED });
}

function executionError(dispatch: React.Dispatch<TransactionAction>, error: Error) {
  dispatch({ error, type: TransactionProgress.EXECUTION_ERROR });
}

export interface TransactionOptions {
  onFinish?: (receipt: TransactionReceipt) => void;
  onAcknowledge?: (receipt: TransactionReceipt) => void;
  onError?: (error: Error) => void;
}

export interface TransactionHookValues<FormValues extends TransactionFormValues = TransactionFormValues> {
  state: TransactionState;
  form: FormContextValues<FormValues>;
  submit: (event: React.BaseSyntheticEvent) => Promise<void>;
  start: (transaction: Transaction) => void;
  cancel: () => void;
  acknowledge: () => void;
}

export function useTransaction(environment: Environment, options?: TransactionOptions) {
  const [state, dispatch] = useReducer(reducer, {
    progress: TransactionProgress.TRANSACTION_WAITING,
    transaction: undefined,
    hash: undefined,
    receipt: undefined,
    error: undefined,
    loading: false,
  } as TransactionState);

  const form = useForm<TransactionFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    validationSchema: Yup.object().shape({
      gasLimit: Yup.number(),
      gasPrice: Yup.number(),
    }),
    defaultValues: {
      gasLimit: `${state.gasLimit || ''}`,
      gasPrice: `${state.gasPrice || ''}`,
    },
  });

  const submit = form.handleSubmit(async data => {
    if (!state.transaction) {
      return;
    }

    try {
      executionPending(dispatch);
      const transaction = state.transaction!;
      const opts = {
        gas: parseFloat(data.gasLimit),
        gasPrice: data.gasPrice,
      };

      await transaction.validate();
      const receipt = await transaction.send(opts).on('transactionHash', hash => executionReceived(dispatch, hash));
      executionFinished(dispatch, receipt);
    } catch (error) {
      executionError(dispatch, error);
    }
  });

  useEffect(() => {
    if (state.progress === TransactionProgress.EXECUTION_FINISHED) {
      options && options.onFinish && options.onFinish(state.receipt!);
    }

    if (state.progress === TransactionProgress.TRANSACTION_ACKNOWLEDGED) {
      options && options.onAcknowledge && options.onAcknowledge(state.receipt!);
    }

    if (
      state.progress === TransactionProgress.EXECUTION_ERROR ||
      state.progress === TransactionProgress.ESTIMATION_ERROR
    ) {
      options && options.onError && options.onError(state.error!);
    }
  }, [state.progress]);

  useEffect(() => {
    if (!state.transaction) {
      return;
    }

    (async () => {
      try {
        estimationPending(dispatch);
        const [price, limit] = await Promise.all([
          await environment.client.getGasPrice(),
          await state.transaction!.estimateGas(),
        ]);

        estimationFinished(dispatch, price, limit);
      } catch (error) {
        estimationError(dispatch, error);
      }
    })();
  }, [state.transaction]);

  useEffect(() => {
    form.setValue('gasLimit', `${state.gasLimit || ''}`);
    form.setValue('gasPrice', `${state.gasPrice || ''}`);
  }, [state.gasLimit, state.gasPrice]);

  const start = (transaction: Transaction) => {
    dispatch({ transaction, type: TransactionProgress.TRANSACTION_STARTED });
  };

  const cancel = () => {
    dispatch({ type: TransactionProgress.TRANSACTION_CANCELLED });
  };

  const acknowledge = () => {
    dispatch({ type: TransactionProgress.TRANSACTION_ACKNOWLEDGED });
  };

  return {
    state,
    form,
    submit,
    start,
    cancel,
    acknowledge,
  } as TransactionHookValues;
}
