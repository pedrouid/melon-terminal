import React from 'react';
import Modal, { ModalProps } from 'styled-react-modal';
import { FormContext } from 'react-hook-form';
import { TransactionHookValues, TransactionProgress } from '~/hooks/useTransaction';
import { ProgressBar } from '~/components/Common/ProgressBar/ProgressBar';
import { ProgressBarStep } from '~/components/Common/ProgressBar/ProgressBarStep/ProgressBarStep';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { FormField } from '~/storybook/components/FormField/FormField';
import { Input } from '~/storybook/components/Input/Input';
import { Button } from '~/storybook/components/Button/Button';
import { Spinner } from '~/components/Common/Spinner/Spinner';
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
            {!estimated && !error && (
              <Spinner />
            )}

            {estimated && (
              <ProgressBar step={currentStep} loading={loadingStep(state.progress)}>
                <ProgressBarStep />
                <ProgressBarStep />
                <ProgressBarStep />
                <ProgressBarStep />
              </ProgressBar>
            )}

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

            {error && <S.NotificationError>{error.message}</S.NotificationError>}

            {estimated && (
              <S.TransactionModalForm onSubmit={submit}>
                {!finished && !(!estimated && error) && (
                  <>
                    <S.TransactionModalFeeForm>
                      <FormField name="gasPrice" label="Gas Price (gwei)">
                        <Input
                          id="gas-price"
                          type="number"
                          name="gasPrice"
                          step=".01"
                          defaultValue={price}
                          disabled={!!loading && estimated}
                        />
                      </FormField>
                      {options && options.amgu && <div>Asset management gas: {options.amgu.toFixed()}</div>}
                      {options && options.incentive && (
                        <div>Incentive for request execution: {options.incentive.toFixed(4)}</div>
                      )}
                    </S.TransactionModalFeeForm>
                  </>
                )}

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
                      <Button type="button" kind="secondary" onClick={() => cancel()}>
                        {estimated ? 'Cancel' : 'Close'}
                      </Button>
                    </S.TransactionModalAction>
                  )}

                  {!finished && estimated && (
                    <S.TransactionModalAction>
                      <Button type="submit" kind="success" disabled={loading}>
                        {error ? 'Retry' : 'Confirm'}
                      </Button>
                    </S.TransactionModalAction>
                  )}

                  {finished && (
                    <S.TransactionModalAction>
                      <Button type="button" kind="success" onClick={() => acknowledge()} disabled={loading}>
                        Close
                      </Button>
                    </S.TransactionModalAction>
                  )}
                </S.TransactionModalActions>
              </S.TransactionModalForm>
            )}
          </S.TransactionModalContent>
        </S.TransactionModal>
      </Modal>
    </FormContext>
  );
};
