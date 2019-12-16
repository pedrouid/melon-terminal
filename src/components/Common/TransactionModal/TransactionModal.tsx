import React from 'react';
import Modal, { ModalProps } from 'styled-react-modal';
import { FormContext } from 'react-hook-form';
import { TransactionHookValues, TransactionProgress } from '~/hooks/useTransaction';
import { ProgressBar } from '~/components/Common/ProgressBar/ProgressBar';
import { ProgressBarStep } from '~/components/Common/ProgressBar/ProgressBarStep/ProgressBarStep';
import { InputField } from '~/components/Common/Form/InputField/InputField';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { CancelButton } from '~/components/Common/Form/CancelButton/CancelButton';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import * as S from './TransactionModal.styles';

function progressToStep(progress: number) {
  if (progress >= TransactionProgress.EXECUTION_FINISHED) {
    return 3;
  }

  if (progress >= TransactionProgress.EXECUTION_RECEIVED) {
    return 2;
  }

  if (progress >= TransactionProgress.EXECUTION_PENDING) {
    return 1;
  }

  return 0;
}

function loadingStep(progress: number) {
  if (progress === TransactionProgress.EXECUTION_PENDING || progress === TransactionProgress.EXECUTION_RECEIVED) {
    return true;
  }

  return false;
}

export interface TransactionModalProps extends Partial<ModalProps> {
  transaction: TransactionHookValues;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction: { form, state, cancel, submit, acknowledge },
  ...rest
}) => {
  const gas = state.ethGasStation;
  const price = state.defaultGasPrice;

  const hash = state.hash;
  const receipt = state.receipt;
  const options = state.sendOptions;
  const output = !!(hash || receipt);

  const error = state.error;
  const loading = state.loading;
  const finished = state.progress >= TransactionProgress.EXECUTION_FINISHED;
  const estimated = state.progress >= TransactionProgress.ESTIMATION_FINISHED;
  const open =
    state.progress < TransactionProgress.TRANSACTION_ACKNOWLEDGED &&
    state.progress > TransactionProgress.TRANSACTION_STARTED;

  const etherscanLink = useEtherscanLink({ hash: state.hash });

  const setGasPrice = (value: number = 0) => {
    form.setValue('gasPrice', value);
  };

  const currentStep = progressToStep(state.progress);

  return (
    <FormContext {...form}>
      <Modal isOpen={open} {...rest}>
        <S.TransactionModal>
          <S.TransactionModalTitle>{state.name}</S.TransactionModalTitle>

          <S.TransactionModalContent>
            <ProgressBar step={currentStep} loading={loadingStep(state.progress)}>
              <ProgressBarStep />
              <ProgressBarStep />
              <ProgressBarStep />
              <ProgressBarStep />
            </ProgressBar>

            {!finished && estimated && gas && (
              <S.EthGasStation>
                <S.EthGasStationButton onClick={() => !loading && setGasPrice(gas!.low)} disabled={loading}>
                  <S.EthGasStationButtonGwei>{gas.low}</S.EthGasStationButtonGwei>
                  <S.EthGasStationButtonText>Low Gas Price</S.EthGasStationButtonText>
                </S.EthGasStationButton>
                <S.EthGasStationButton onClick={() => !loading && setGasPrice(gas!.average)} disabled={loading}>
                  <S.EthGasStationButtonGwei>{gas.average}</S.EthGasStationButtonGwei>
                  <S.EthGasStationButtonText>Average Gas Price</S.EthGasStationButtonText>
                </S.EthGasStationButton>
                <S.EthGasStationButton onClick={() => !loading && setGasPrice(gas!.fast)} disabled={loading}>
                  <S.EthGasStationButtonGwei>{gas.fast}</S.EthGasStationButtonGwei>
                  <S.EthGasStationButtonText>Fast Gas Price</S.EthGasStationButtonText>
                </S.EthGasStationButton>
              </S.EthGasStation>
            )}

            <S.TransactionModalForm onSubmit={submit}>
              {!finished && !(!estimated && error) && (
                <>
                  <S.TransactionModalFeeForm>
                    <InputField
                      id="gas-price"
                      type="number"
                      name="gasPrice"
                      label="Gas Price (GWEI)"
                      step=".01"
                      defaultValue={price}
                      disabled={!!loading && estimated}
                    />
                    {options && options.gas && <div>Gas limit: {options.gas}</div>}
                    {options && options.amgu && <div>AMGU: {options.amgu.toFixed(4)}</div>}
                    {options && options.incentive && <div>INCENTIVE: {options.incentive.toFixed(4)}</div>}
                  </S.TransactionModalFeeForm>
                  <S.TransactionModalMessage>
                    If you do not change the gas price field, the default gas price will be used. If you wish to set the
                    gas price according to network conditions, please refer to Eth Gas Station.
                  </S.TransactionModalMessage>
                </>
              )}

              {error && <S.NotificationError>{error.message}</S.NotificationError>}

              {output && (
                <S.TransactionModalMessages>
                  <S.TransactionModalMessagesTable>
                    <S.TransactionModalMessagesTableBody>
                      {hash && (
                        <S.TransactionModalMessagesTableRow>
                          <S.TransactionModalMessagesTableRowLabel>Hash</S.TransactionModalMessagesTableRowLabel>
                          <S.TransactionModalMessagesTableRowQuantity>
                            <a target="_blank" href={etherscanLink || ''}>
                              {hash}
                            </a>
                          </S.TransactionModalMessagesTableRowQuantity>
                        </S.TransactionModalMessagesTableRow>
                      )}
                      {receipt && (
                        <S.TransactionModalMessagesTableRow>
                          <S.TransactionModalMessagesTableRowLabel>
                            Block number
                          </S.TransactionModalMessagesTableRowLabel>
                          <S.TransactionModalMessagesTableRowQuantity>
                            {receipt.blockNumber}
                          </S.TransactionModalMessagesTableRowQuantity>
                        </S.TransactionModalMessagesTableRow>
                      )}
                      {receipt && (
                        <S.TransactionModalMessagesTableRow>
                          <S.TransactionModalMessagesTableRowLabel>Gas used</S.TransactionModalMessagesTableRowLabel>
                          <S.TransactionModalMessagesTableRowQuantity>
                            {receipt.gasUsed}
                          </S.TransactionModalMessagesTableRowQuantity>
                        </S.TransactionModalMessagesTableRow>
                      )}
                      {receipt && (
                        <S.TransactionModalMessagesTableRow>
                          <S.TransactionModalMessagesTableRowLabel>
                            Cumulative gas used
                          </S.TransactionModalMessagesTableRowLabel>
                          <S.TransactionModalMessagesTableRowQuantity>
                            {receipt.cumulativeGasUsed}
                          </S.TransactionModalMessagesTableRowQuantity>
                        </S.TransactionModalMessagesTableRow>
                      )}
                    </S.TransactionModalMessagesTableBody>
                  </S.TransactionModalMessagesTable>
                </S.TransactionModalMessages>
              )}

              <S.TransactionModalActions>
                {!finished && (
                  <S.TransactionModalAction>
                    <CancelButton label={estimated ? 'Cancel' : 'Close'} onClick={() => cancel()} />
                  </S.TransactionModalAction>
                )}

                {!finished && estimated && (
                  <S.TransactionModalAction>
                    <SubmitButton label={error ? 'Retry' : 'Confirm'} disabled={loading} />
                  </S.TransactionModalAction>
                )}

                {finished && (
                  <S.TransactionModalAction>
                    <SubmitButton label="Close" onClick={() => acknowledge()} />
                  </S.TransactionModalAction>
                )}
              </S.TransactionModalActions>
            </S.TransactionModalForm>
          </S.TransactionModalContent>
        </S.TransactionModal>
      </Modal>
    </FormContext>
  );
};
