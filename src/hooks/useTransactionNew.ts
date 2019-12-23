import React, { useReducer } from 'react';
import BigNumber from 'bignumber.js';
import { TransactionReceipt } from 'web3-core';
import { Transaction, SendOptions } from '@melonproject/melonjs';
import { useOnChainQueryRefetcher } from './useOnChainQueryRefetcher';

export interface TransactionState {
  progress?: TransactionProgress;
  options?: SendOptions;
  transaction?: Transaction;
  hash?: string;
  receipt?: TransactionReceipt;
  error?: Error;
}

export enum TransactionProgress {
  // Pre-execution phase.
  PREPARATION_PENDING, // The transaction is being prepared.
  PREPARATION_FINISHED, // The transaction has been estimated and validated.
  // Execution phase.
  EXECUTION_PENDING, // The transaction has been sent to the signer.
  EXECUTION_RECEIVED, // The transaction has been signed and was forwarded to the node. We now have a transaction hash.
  EXECUTION_FINISHED, // The transaction has been executed successfuly and we have a receipt.
}

export enum TransactionActionType {
  TRANSACTION_RESET,
  TRANSACTION_START,
  PREPARATION_ERROR,
  PREPARATION_PENDING,
  PREPARATION_FINISHED,
  EXECUTION_ERROR,
  EXECUTION_PENDING,
  EXECUTION_RECEIVED,
  EXECUTION_FINISHED,
}

type TransactionAction =
  | TransactionReset
  | TransactionStart
  | TransactionReset
  | PreparationPending
  | PreparationFinished
  | PreparationError
  | ExecutionPending
  | ExecutionReceived
  | ExecutionFinished
  | ExecutionError;

interface TransactionReset {
  type: TransactionActionType.TRANSACTION_RESET;
}

interface TransactionStart {
  type: TransactionActionType.TRANSACTION_START;
}

interface TransactionReset {
  type: TransactionActionType.TRANSACTION_RESET;
}

interface PreparationPending {
  type: TransactionActionType.PREPARATION_PENDING;
}

interface PreparationFinished {
  type: TransactionActionType.PREPARATION_FINISHED;
  transaction: Transaction;
  options: SendOptions;
}

interface PreparationError {
  type: TransactionActionType.PREPARATION_ERROR;
  error: Error;
}

interface ExecutionPending {
  type: TransactionActionType.EXECUTION_PENDING;
}

interface ExecutionReceived {
  type: TransactionActionType.EXECUTION_RECEIVED;
  hash: string;
}

interface ExecutionFinished {
  type: TransactionActionType.EXECUTION_FINISHED;
  receipt: TransactionReceipt;
}

interface ExecutionError {
  type: TransactionActionType.EXECUTION_ERROR;
  error: Error;
}

const initialState: TransactionState = {
  progress: undefined,
  transaction: undefined,
  hash: undefined,
  receipt: undefined,
  error: undefined,
};

function reducer(state: TransactionState, action: TransactionAction): TransactionState {
  switch (action.type) {
    case TransactionActionType.TRANSACTION_RESET: {
      return { ...initialState };
    }

    case TransactionActionType.PREPARATION_ERROR:
    case TransactionActionType.EXECUTION_ERROR: {
      return {
        ...state,
        error: action.error,
      };
    }

    case TransactionActionType.PREPARATION_PENDING: {
      return {
        ...state,
        progress: TransactionProgress.PREPARATION_PENDING,
      };
    }

    case TransactionActionType.PREPARATION_FINISHED:
      return {
        ...state,
        progress: TransactionProgress.PREPARATION_FINISHED,
        transaction: action.transaction,
        options: action.options,
      };

    case TransactionActionType.EXECUTION_PENDING: {
      return {
        ...state,
        progress: TransactionProgress.EXECUTION_PENDING,
      };
    }

    case TransactionActionType.EXECUTION_RECEIVED: {
      return {
        ...state,
        progress: TransactionProgress.EXECUTION_RECEIVED,
        hash: action.hash,
      };
    }

    case TransactionActionType.EXECUTION_FINISHED: {
      return {
        ...state,
        progress: TransactionProgress.EXECUTION_FINISHED,
        receipt: action.receipt,
      };
    }

    default: {
      return state;
    }
  }
}

function resetTransaction(dispatch: React.Dispatch<TransactionAction>) {
  dispatch({ type: TransactionActionType.TRANSACTION_RESET });
}

function preparationPending(dispatch: React.Dispatch<TransactionAction>) {
  dispatch({ type: TransactionActionType.PREPARATION_PENDING });
}

function preparationFinished(
  dispatch: React.Dispatch<TransactionAction>,
  transaction: Transaction,
  options: SendOptions
) {
  dispatch({ transaction, options, type: TransactionActionType.PREPARATION_FINISHED });
}

function preparationError(dispatch: React.Dispatch<TransactionAction>, error: Error) {
  dispatch({ error, type: TransactionActionType.PREPARATION_ERROR });
}

function executionPending(dispatch: React.Dispatch<TransactionAction>) {
  dispatch({ type: TransactionActionType.EXECUTION_PENDING });
}

function executionReceived(dispatch: React.Dispatch<TransactionAction>, hash: string) {
  dispatch({ hash, type: TransactionActionType.EXECUTION_RECEIVED });
}

function executionFinished(dispatch: React.Dispatch<TransactionAction>, receipt: TransactionReceipt) {
  dispatch({ receipt, type: TransactionActionType.EXECUTION_FINISHED });
}

function executionError(dispatch: React.Dispatch<TransactionAction>, error: Error) {
  dispatch({ error, type: TransactionActionType.EXECUTION_ERROR });
}

export interface TransactionHookValues<T = undefined | any> {
  state: TransactionState;
  reset: () => void;
  initialize: (value?: T) => Promise<void>;
  execute: (price: BigNumber) => void;
}

export function useTransaction<T = undefined | any>(
  create: (values: T) => Promise<Transaction<TransactionReceipt>> | Transaction<TransactionReceipt>
): TransactionHookValues<T> {
  const refetch = useOnChainQueryRefetcher();
  const [state, dispatch] = useReducer(reducer, initialState);

  const reset = () => resetTransaction(dispatch);
  const initialize = async (values: T) => {
    if (state.progress != null) {
      throw new Error('The transaction has already been initialized.');
    }

    try {
      preparationPending(dispatch);
      const transaction = await create(values);
      const opts = await transaction.validate().then(() => transaction.prepare());
      preparationFinished(dispatch, transaction, opts);
    } catch (error) {
      return preparationError(dispatch, error);
    }
  };

  const execute = async (price: BigNumber) => {
    if (!(state.transaction && state.options)) {
      throw new Error('Missing transaction or transaction options.');
    }

    try {
      executionPending(dispatch);
      const transaction = state.transaction!;
      const opts: SendOptions = {
        gasPrice: price.toString(),
        ...(state.options && state.options.gas && { gas: state.options.gas }),
        ...(state.options && state.options.amgu && { amgu: state.options.amgu }),
        ...(state.options && state.options.incentive && { incentive: state.options.incentive }),
      };

      const receipt = await transaction.send(opts).once('transactionHash', hash => executionReceived(dispatch, hash));

      // TODO: Find a better way for this than doing a full refetch of the entire current window state.
      await refetch();

      executionFinished(dispatch, receipt);
    } catch (error) {
      executionError(dispatch, error);
    }
  };

  return {
    state,
    initialize,
    execute,
    reset,
  } as TransactionHookValues<T>;
}
