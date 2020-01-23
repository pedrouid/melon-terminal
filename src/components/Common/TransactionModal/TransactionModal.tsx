import React from 'react';
import Modal, { ModalProps } from 'styled-react-modal';
import { FormContext } from 'react-hook-form';
import { TransactionHookValues, TransactionProgress } from '~/hooks/useTransaction';
import { ProgressBar } from '~/components/Common/ProgressBar/ProgressBar';
import { ProgressBarStep } from '~/components/Common/ProgressBar/ProgressBarStep/ProgressBarStep';
import { Input } from '~/storybook/components/Input/Input';
import { Button } from '~/storybook/components/Button/Button';
import { NotificationBar, NotificationContent } from '~/storybook/components/NotificationBar/NotificationBar';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import * as S from '~/storybook/components/Modal/Modal';
import { EtherscanLink } from '../EtherscanLink/EtherscanLink';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { BigNumber } from 'bignumber.js';
import { useCoinAPI } from '~/hooks/useCoinAPI';
import { useEnvironment } from '~/hooks/useEnvironment';

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
  const defaultGasPrice = state.defaultGasPrice;

  const coinApi = useCoinAPI();
  const environment = useEnvironment();

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

  const price = form.watch('gasPrice') ?? defaultGasPrice;

  const gasPriceEth = new BigNumber(options?.gas ?? 'NaN').multipliedBy(new BigNumber(price)).multipliedBy('1e9');
  const gasPriceUsd = gasPriceEth.multipliedBy(coinApi.data.rate);

  const amguUsd = options?.amgu?.multipliedBy(coinApi.data.rate) ?? new BigNumber('NaN');
  const incentiveUsd = options?.incentive?.multipliedBy(coinApi.data.rate) ?? new BigNumber('NaN');

  const totalEth = gasPriceEth?.plus(options?.amgu ?? 0).plus(options?.incentive ?? 0);
  const totalUsd = totalEth.multipliedBy(coinApi.data.rate);

  const setGasPrice = (value: number = 0) => {
    form.setValue('gasPrice', value);
  };

  const currentStep = progressToStep(state.progress);

  const errorReportingUri = encodeURI(
    `https://github.com/avantgardefinance/interface/issues/new?title=Error in transaction "${state.name}";body=${error?.stack}`
  );

  return (
    <FormContext {...form}>
      <Modal isOpen={open} {...rest}>
        <S.TransactionModal>
          <S.TransactionModalTitle>
            <S.TransactionModalName>{state.name}</S.TransactionModalName>
            <S.TransactionModalNetwork>{environment?.network} </S.TransactionModalNetwork>
          </S.TransactionModalTitle>

          {error && (
            <NotificationBar kind="error">
              <NotificationContent>{error.message}</NotificationContent>
              <NotificationContent>
                <a href={errorReportingUri}>Report error</a>
              </NotificationContent>
            </NotificationBar>
          )}

          <S.TransactionModalContent>
            {!estimated && !error && <Spinner />}

            {finished && <NotificationBar kind="success">Transaction successful!</NotificationBar>}

            {estimated && !finished && (
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

            <S.TransactionModalForm onSubmit={submit}>
              {estimated && !finished && (
                <>
                  <S.TransactionModalFeeForm>
                    <Input
                      id="gas-price"
                      type="number"
                      name="gasPrice"
                      label="Gas Price (gwei)"
                      step=".01"
                      max={8000000}
                      defaultValue={defaultGasPrice}
                      disabled={!!loading && estimated}
                    />
                    <S.CostsTable>
                      <S.CostsTableHead>
                        <S.CostsTableRow>
                          <S.CostsTableHeaderCellText />
                          <S.CostsTableHeaderCell>Amount</S.CostsTableHeaderCell>
                          <S.CostsTableHeaderCell>Costs [ETH]</S.CostsTableHeaderCell>
                          <S.CostsTableHeaderCell>Costs [USD]</S.CostsTableHeaderCell>
                        </S.CostsTableRow>
                      </S.CostsTableHead>

                      <S.CostsTableBody>
                        {options && options.gas && gasPriceEth && (
                          <S.CostsTableRow>
                            <S.CostsTableCellText>Gas</S.CostsTableCellText>
                            <S.CostsTableCell>
                              <FormattedNumber value={options.gas} decimals={0} />
                            </S.CostsTableCell>
                            <S.CostsTableCell>
                              <FormattedNumber value={fromTokenBaseUnit(gasPriceEth, 18)} suffix="ETH" />
                            </S.CostsTableCell>
                            <S.CostsTableCell>
                              <FormattedNumber value={fromTokenBaseUnit(gasPriceUsd, 18)} suffix="USD" />
                            </S.CostsTableCell>
                          </S.CostsTableRow>
                        )}

                        {options && options.amgu && (
                          <S.CostsTableRow>
                            <S.CostsTableCellText>Asset management gas</S.CostsTableCellText>
                            <S.CostsTableCell />
                            <S.CostsTableCell>
                              <FormattedNumber value={fromTokenBaseUnit(options.amgu, 18)} suffix="ETH" />
                            </S.CostsTableCell>
                            <S.CostsTableCell>
                              <FormattedNumber value={fromTokenBaseUnit(amguUsd, 18)} suffix="USD" />
                            </S.CostsTableCell>
                          </S.CostsTableRow>
                        )}

                        {options && options.incentive && (
                          <S.CostsTableRow>
                            <S.CostsTableCellText>Incentive</S.CostsTableCellText>
                            <S.CostsTableCell />
                            <S.CostsTableCell>
                              <FormattedNumber value={fromTokenBaseUnit(options.incentive, 18)} suffix="ETH" />
                            </S.CostsTableCell>
                            <S.CostsTableCell>
                              <FormattedNumber value={fromTokenBaseUnit(incentiveUsd, 18)} suffix="USD" />
                            </S.CostsTableCell>
                          </S.CostsTableRow>
                        )}

                        {totalEth && (
                          <S.CostsTableRowTotal>
                            <S.CostsTableCellText>Total</S.CostsTableCellText>
                            <S.CostsTableCell />
                            <S.CostsTableCell>
                              <FormattedNumber value={fromTokenBaseUnit(totalEth, 18)} suffix="ETH" />
                            </S.CostsTableCell>
                            <S.CostsTableCell>
                              <FormattedNumber value={fromTokenBaseUnit(totalUsd, 18)} suffix="USD" />
                            </S.CostsTableCell>
                          </S.CostsTableRowTotal>
                        )}
                      </S.CostsTableBody>
                    </S.CostsTable>
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
                            <EtherscanLink hash={hash} />
                          </S.TransactionModalMessagesTableRowQuantity>
                        </S.TransactionModalMessagesTableRow>
                      )}

                      {receipt && (
                        <>
                          <S.TransactionModalMessagesTableRow>
                            <S.TransactionModalMessagesTableRowLabel>Gas used</S.TransactionModalMessagesTableRowLabel>
                            <S.TransactionModalMessagesTableRowQuantity>
                              <FormattedNumber value={receipt.gasUsed} decimals={0}></FormattedNumber>
                            </S.TransactionModalMessagesTableRowQuantity>
                          </S.TransactionModalMessagesTableRow>

                          <S.TransactionModalMessagesTableRow>
                            <S.TransactionModalMessagesTableRowLabel>Gas cost</S.TransactionModalMessagesTableRowLabel>
                            <S.TransactionModalMessagesTableRowQuantity>
                              <FormattedNumber
                                value={fromTokenBaseUnit(
                                  new BigNumber(receipt.gasUsed).multipliedBy(price).multipliedBy('1e9'),
                                  18
                                )}
                                suffix="ETH"
                              />
                              {' ('}
                              <FormattedNumber
                                value={fromTokenBaseUnit(
                                  new BigNumber(receipt.gasUsed)
                                    .multipliedBy(price)
                                    .multipliedBy('1e9')
                                    .multipliedBy(coinApi.data.rate),
                                  18
                                )}
                                suffix="USD"
                              />
                              {')'}
                            </S.TransactionModalMessagesTableRowQuantity>
                          </S.TransactionModalMessagesTableRow>
                        </>
                      )}
                    </S.TransactionModalMessagesTableBody>
                  </S.TransactionModalMessagesTable>
                </S.TransactionModalMessages>
              )}

              <S.TransactionModalActions>
                {!finished && (
                  <S.TransactionModalAction>
                    <Button type="button" kind="secondary" length="stretch" onClick={() => cancel()}>
                      {estimated ? 'Cancel' : 'Close'}
                    </Button>
                  </S.TransactionModalAction>
                )}

                {!finished && estimated && (
                  <S.TransactionModalAction>
                    <Button type="submit" kind="success" length="stretch" disabled={loading}>
                      {error ? 'Retry' : 'Confirm'}
                    </Button>
                  </S.TransactionModalAction>
                )}

                {finished && (
                  <S.TransactionModalAction>
                    <Button
                      type="button"
                      kind="success"
                      length="stretch"
                      onClick={() => acknowledge()}
                      disabled={loading}
                    >
                      Acknowledge
                    </Button>
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
