import React from 'react';
import Modal, { ModalProps } from 'styled-react-modal';
import { TransactionHookValues, TransactionProgress } from '~/hooks/useTransaction';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { ProgressBar } from '~/components/Common/ProgressBar/ProgressBar';
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
  transaction: { state, form, cancel, submit, acknowledge },
  ...rest
}) => {
  const finished = state.progress >= TransactionProgress.EXECUTION_FINISHED;
  const open =
    state.progress < TransactionProgress.TRANSACTION_ACKNOWLEDGED &&
    state.progress > TransactionProgress.TRANSACTION_STARTED;

  return (
    <Modal isOpen={open} {...rest}>
      <S.TransactionModal>
        <S.TransactionModalTitle>{rest.title}</S.TransactionModalTitle>
        {state.loading && <Spinner />}

        <S.TransactionModalContent>
          {!finished && (
            <S.TransactionModalForm onSubmit={submit}>
              <S.TransactionModalFeeForm>
                <S.TransactionModalInput>
                  <S.TransactionModalInputLabel>Gas price</S.TransactionModalInputLabel>
                  <S.TransactionModalInputField
                    id="gas-price"
                    type="number"
                    step="any"
                    name="gasPrice"
                    ref={form.register}
                    disabled={state.loading}
                  />
                </S.TransactionModalInput>
                <S.TransactionModalInput>
                  <S.TransactionModalInputLabel>Gas limit</S.TransactionModalInputLabel>
                  <S.TransactionModalInputField
                    id="gas-limit"
                    type="number"
                    step="any"
                    name="gasLimit"
                    ref={form.register}
                    disabled={state.loading}
                  />
                </S.TransactionModalInput>
              </S.TransactionModalFeeForm>
              <S.TransactionModalMessage>
                If you do not change the gas price field, the default gas price will be used. If you wish to set the gas
                price according to network conditions, please refer to Eth Gas Station.
              </S.TransactionModalMessage>
              <S.TransactionModalActions>
                <S.TransactionModalAction>
                  <S.TransactionModalCancel type="button" disabled={state.loading} onClick={() => cancel()}>
                    Cancel
                  </S.TransactionModalCancel>
                </S.TransactionModalAction>
                <S.TransactionModalAction>
                  <S.TransactionModalConfirm type="submit" disabled={state.loading}>
                    {state.error ? 'Retry' : 'Confirm'}
                  </S.TransactionModalConfirm>
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
              <S.TransactionModalConfirm type="submit" onClick={() => acknowledge()}>
                Close
              </S.TransactionModalConfirm>
            </S.TransactionModalAction>
          )}
        </S.TransactionModalContent>
      </S.TransactionModal>
    </Modal>
  );
};
