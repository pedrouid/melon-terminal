import React from 'react';
import Modal, { ModalProps } from 'styled-react-modal';
import { FormContext } from 'react-hook-form';
import { TransactionHookValues, TransactionProgress } from '~/hooks/useTransaction';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { ProgressBar } from '~/components/Common/ProgressBar/ProgressBar';
import { InputField } from '~/components/Common/Form/InputField/InputField';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { CancelButton } from '~/components/Common/Form/CancelButton/CancelButton';
import * as S from './TransactionModal.styles';

function progressToPercentage(progress?: TransactionProgress) {
  if (progress && progress < TransactionProgress.ESTIMATION_FINISHED) {
    return 0;
  }

  if (progress && progress < TransactionProgress.EXECUTION_PENDING) {
    return 25;
  }

  if (progress && progress < TransactionProgress.EXECUTION_RECEIVED) {
    return 50;
  }

  if (progress && progress < TransactionProgress.EXECUTION_FINISHED) {
    return 75;
  }

  if (progress && progress === TransactionProgress.EXECUTION_FINISHED) {
    return 100;
  }

  return 0;
}

export interface TransactionModalProps extends Partial<ModalProps> {
  transaction: TransactionHookValues;
  title: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction: { form, state, cancel, submit, acknowledge },
  ...rest
}) => {
  const error = state.error;
  const finished = state.progress >= TransactionProgress.EXECUTION_FINISHED;
  const open =
    state.progress < TransactionProgress.TRANSACTION_ACKNOWLEDGED &&
    state.progress > TransactionProgress.TRANSACTION_STARTED;

  return (
    <FormContext {...form}>
      <Modal isOpen={open} {...rest}>
        <S.TransactionModal>
          <S.TransactionModalTitle>{rest.title}</S.TransactionModalTitle>
          {state.loading && <Spinner />}

          <S.TransactionModalContent>
            {!finished && (
              <S.TransactionModalForm onSubmit={submit}>
                {!error && !state.loading && (
                  <>
                    <S.TransactionModalFeeForm>
                      <InputField id="gas-price" type="number" name="gasPrice" label="Gas Price (GWEI)" />
                      <div>Gas limit: {state.gasLimit}</div>
                      {state.amguValue && <div>AMGU: {state.amguValue.toFixed()}</div>}
                      {state.incentiveValue && <div>INCENTIVE: {state.incentiveValue.toFixed()}</div>}
                    </S.TransactionModalFeeForm>
                    <S.TransactionModalMessage>
                      If you do not change the gas price field, the default gas price will be used. If you wish to set
                      the gas price according to network conditions, please refer to Eth Gas Station.
                    </S.TransactionModalMessage>
                  </>
                )}
                <S.TransactionModalActions>
                  <S.TransactionModalAction>
                    <CancelButton disabled={state.loading} label="Cancel" onClick={() => cancel()} />
                  </S.TransactionModalAction>
                  <S.TransactionModalAction>
                    <SubmitButton disabled={state.loading} label={state.error ? 'Retry' : 'Confirm'} />
                  </S.TransactionModalAction>
                </S.TransactionModalActions>
              </S.TransactionModalForm>
            )}

            <S.TransactionModalMessages>
              <ProgressBar progress={progressToPercentage(state.progress)} />
              <S.TransactionModalMessagesTable>
                <S.TransactionModalMessagesTableBody>
                  {state.progress && (
                    <S.TransactionModalMessagesTableRow>
                      <S.TransactionModalMessagesTableRowLabel>State</S.TransactionModalMessagesTableRowLabel>
                      <S.TransactionModalMessagesTableRowQuantity>
                        {state.progress}
                      </S.TransactionModalMessagesTableRowQuantity>
                    </S.TransactionModalMessagesTableRow>
                  )}
                  {state.hash && (
                    <S.TransactionModalMessagesTableRow>
                      <S.TransactionModalMessagesTableRowLabel>Hash</S.TransactionModalMessagesTableRowLabel>
                      <S.TransactionModalMessagesTableRowQuantity>
                        {state.hash}
                      </S.TransactionModalMessagesTableRowQuantity>
                    </S.TransactionModalMessagesTableRow>
                  )}
                  {state.error && (
                    <S.TransactionModalMessagesTableRow>
                      <S.TransactionModalMessagesTableRowLabel>Error</S.TransactionModalMessagesTableRowLabel>
                      <S.TransactionModalMessagesTableRowQuantity>
                        {state.error.message}
                      </S.TransactionModalMessagesTableRowQuantity>
                    </S.TransactionModalMessagesTableRow>
                  )}
                  {state.receipt && (
                    <S.TransactionModalMessagesTableRow>
                      <S.TransactionModalMessagesTableRowLabel>Block number</S.TransactionModalMessagesTableRowLabel>
                      <S.TransactionModalMessagesTableRowQuantity>
                        {state.receipt.blockNumber}
                      </S.TransactionModalMessagesTableRowQuantity>
                    </S.TransactionModalMessagesTableRow>
                  )}
                  {state.receipt && (
                    <S.TransactionModalMessagesTableRow>
                      <S.TransactionModalMessagesTableRowLabel>Gas used</S.TransactionModalMessagesTableRowLabel>
                      <S.TransactionModalMessagesTableRowQuantity>
                        {state.receipt.gasUsed}
                      </S.TransactionModalMessagesTableRowQuantity>
                    </S.TransactionModalMessagesTableRow>
                  )}
                  {state.receipt && (
                    <S.TransactionModalMessagesTableRow>
                      <S.TransactionModalMessagesTableRowLabel>
                        Cumulative gas used
                      </S.TransactionModalMessagesTableRowLabel>
                      <S.TransactionModalMessagesTableRowQuantity>
                        {state.receipt.cumulativeGasUsed}
                      </S.TransactionModalMessagesTableRowQuantity>
                    </S.TransactionModalMessagesTableRow>
                  )}
                </S.TransactionModalMessagesTableBody>
              </S.TransactionModalMessagesTable>
            </S.TransactionModalMessages>

            {finished && (
              <S.TransactionModalAction>
                <SubmitButton label="Close" onClick={() => acknowledge()} />
              </S.TransactionModalAction>
            )}
          </S.TransactionModalContent>
        </S.TransactionModal>
      </Modal>
    </FormContext>
  );
};
