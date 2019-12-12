import React, { useEffect } from 'react';
import Modal, { ModalProps } from 'styled-react-modal';
import { FormContext } from 'react-hook-form';
import { TransactionHookValues, TransactionProgress } from '~/hooks/useTransaction';
import { ProgressBar } from '~/components/Common/ProgressBar/ProgressBar';
import { ProgressBarStep } from '~/components/Common/ProgressBar/ProgressBarStep/ProgressBarStep';
import { InputField } from '~/components/Common/Form/InputField/InputField';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { CancelButton } from '~/components/Common/Form/CancelButton/CancelButton';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { useEnvironment } from '~/hooks/useEnvironment';
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
  const error = state.error;
  const finished = state.progress >= TransactionProgress.EXECUTION_FINISHED;
  const open =
    state.progress < TransactionProgress.TRANSACTION_ACKNOWLEDGED &&
    state.progress > TransactionProgress.TRANSACTION_STARTED;

  const etherscanLink = useEtherscanLink({ hash: state.hash });
  const environment = useEnvironment();
  const network = environment && environment.network;

  const setGasPrice = (value: number = 0) => {
    form.setValue('gasPrice', value.toString());
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
            {!finished && (
              <>
                {!error && !state.loading && state.ethGasStation && network === 'MAINNET' && (
                  <S.EthGasStation>
                    <S.EthGasStationButton onClick={() => setGasPrice(state.ethGasStation!.low)}>
                      <S.EthGasStationButtonGwei>{state.ethGasStation.low}</S.EthGasStationButtonGwei>
                      <S.EthGasStationButtonText>Low Gas Price</S.EthGasStationButtonText>
                    </S.EthGasStationButton>
                    <S.EthGasStationButton onClick={() => setGasPrice(state.ethGasStation!.average)}>
                      <S.EthGasStationButtonGwei>{state.ethGasStation.average}</S.EthGasStationButtonGwei>
                      <S.EthGasStationButtonText>Average Gas Price</S.EthGasStationButtonText>
                    </S.EthGasStationButton>
                    <S.EthGasStationButton onClick={() => setGasPrice(state.ethGasStation!.fast)}>
                      <S.EthGasStationButtonGwei>{state.ethGasStation.fast}</S.EthGasStationButtonGwei>
                      <S.EthGasStationButtonText>Fast Gas Price</S.EthGasStationButtonText>
                    </S.EthGasStationButton>
                  </S.EthGasStation>
                )}
                <S.TransactionModalForm onSubmit={submit}>
                  {!error && !state.loading && (
                    <>
                      <S.TransactionModalFeeForm>
                        <InputField id="gas-price" type="number" name="gasPrice" label="Gas Price (GWEI)" step=".01" />
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
                  {state.error && <S.NotificationError>{state.error.message} </S.NotificationError>}
                  <S.TransactionModalMessages>
                    <S.TransactionModalMessagesTable>
                      <S.TransactionModalMessagesTableBody>
                        {/* {state.progress && (
                          <S.TransactionModalMessagesTableRow>
                            <S.TransactionModalMessagesTableRowLabel>State</S.TransactionModalMessagesTableRowLabel>
                            <S.TransactionModalMessagesTableRowQuantity>
                              {state.progress}
                            </S.TransactionModalMessagesTableRowQuantity>
                          </S.TransactionModalMessagesTableRow>
                        )} */}
                        {state.hash && (
                          <S.TransactionModalMessagesTableRow>
                            <S.TransactionModalMessagesTableRowLabel>Hash</S.TransactionModalMessagesTableRowLabel>
                            <S.TransactionModalMessagesTableRowQuantity>
                              <a target="_blank" href={etherscanLink || ''}>
                                {state.hash}
                              </a>
                            </S.TransactionModalMessagesTableRowQuantity>
                          </S.TransactionModalMessagesTableRow>
                        )}
                        {state.receipt && (
                          <S.TransactionModalMessagesTableRow>
                            <S.TransactionModalMessagesTableRowLabel>
                              Block number
                            </S.TransactionModalMessagesTableRowLabel>
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

                  <S.TransactionModalActions>
                    <S.TransactionModalAction>
                      <CancelButton disabled={true} label="Cancel" onClick={() => cancel()} />
                    </S.TransactionModalAction>
                    {!state.loading && (
                      <S.TransactionModalAction>
                        <SubmitButton disabled={state.loading} label={state.error ? 'Retry' : 'Confirm'} />
                      </S.TransactionModalAction>
                    )}
                  </S.TransactionModalActions>
                </S.TransactionModalForm>
              </>
            )}

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
