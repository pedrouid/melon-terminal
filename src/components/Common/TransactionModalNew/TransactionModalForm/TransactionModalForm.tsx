import React, { useState, useEffect, useMemo } from 'react';
import useForm, { FormContext } from 'react-hook-form';
import BigNumber from 'bignumber.js';
import { object, number } from 'yup';
import { InputField } from '~/components/Common/Form/InputField/InputField';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { CancelButton } from '~/components/Common/Form/CancelButton/CancelButton';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { useEnvironment } from '~/hooks/useEnvironment';
import { TransactionState, TransactionProgress } from '~/hooks/useTransactionNew';
import { Environment } from '~/environment';
import { NetworkEnum } from '~/types';
import * as S from './TransactionModalForm.styles';

interface GasPrices {
  loading: boolean;
  network?: BigNumber;
  fast?: BigNumber;
  slow?: BigNumber;
  average?: BigNumber;
}

function useGasPrices() {
  const environment = useEnvironment()!;
  const [state, setState] = useState<GasPrices>({ loading: true });

  useEffect(() => {
    (async () => {
      setState({ ...state, loading: true });

      const [ethGasStation, networkDefault] = await Promise.all([
        fetchEthGasStationPrices(environment),
        fetchNetworkDefaultPrice(environment),
      ]);

      setState({
        loading: false,
        ...(networkDefault && { network: networkDefault }),
        ...(ethGasStation && { ...ethGasStation }),
      });
    })();
  }, [environment.network]);

  return state;
}

async function fetchEthGasStationPrices(environment: Environment) {
  if (environment.network !== NetworkEnum.MAINNET) {
    return undefined;
  }

  try {
    const result = await fetch('https://ethgasstation.info/json/ethgasAPI.json').then(result => result.json());
    const json = await result.json();

    return {
      fast: new BigNumber(json.fast).dividedBy(10),
      slow: new BigNumber(json.safeLow).dividedBy(10),
      average: new BigNumber(json.average).dividedBy(10),
    };
  } catch (error) {
    return undefined;
  }
}

async function fetchNetworkDefaultPrice(environment: Environment) {
  try {
    const price = await environment.client.getGasPrice();
    return new BigNumber(price).dividedBy('10e9');
  } catch (error) {
    return undefined;
  }
}

export interface TransactionModalFormProps {
  transaction: TransactionState;
  close: () => void;
  reset: () => void;
  execute: (price: BigNumber) => void;
}

export const TransactionModalForm: React.FC<TransactionModalFormProps> = props => {
  const hash = props.transaction.hash;
  const receipt = props.transaction.receipt;
  const errored = !!props.transaction.error;
  const progress = props.transaction.progress ?? -1;
  const received = progress >= TransactionProgress.EXECUTION_RECEIVED;
  const prepared = progress >= TransactionProgress.PREPARATION_FINISHED;
  const started = progress >= TransactionProgress.EXECUTION_PENDING;
  const finished = progress >= TransactionProgress.EXECUTION_FINISHED;

  const etherscan = useEtherscanLink({ hash: props.transaction.hash });
  const prices = useGasPrices();
  const price = useMemo(() => {
    if (!prices.loading && prices.average) {
      return prices.average;
    }

    if (!prices.loading && prices.network) {
      return prices.network;
    }
  }, [prices]);

  const form = useForm({
    validationSchema: useMemo(
      () =>
        object({
          gasPrice: number()
            .positive()
            .required(),
        }),
      []
    ),
  });

  const set = (value: BigNumber) => form.setValue('gasPrice', value.toString());
  const submit = form.handleSubmit(data => props.execute(new BigNumber(data.gasPrice).multipliedBy('10e9')));

  useEffect(() => {
    price && set(price);
  }, [price]);

  const actions = useMemo(() => {
    if (!finished && !errored) {
      return (
        <>
          <S.TransactionModalAction>
            <CancelButton label="Cancel" onClick={() => props.close()} disabled={started} />
          </S.TransactionModalAction>
          <S.TransactionModalAction>
            <SubmitButton label="Confirm" disabled={started || prices.loading} />
          </S.TransactionModalAction>
        </>
      );
    }

    if (!finished && errored) {
      return (
        <>
          <S.TransactionModalAction>
            <CancelButton label="Close" onClick={() => props.close()} />
          </S.TransactionModalAction>
          <S.TransactionModalAction>
            <SubmitButton label="Retry" type="button" onClick={() => props.reset()} />
          </S.TransactionModalAction>
        </>
      );
    }

    if (finished) {
      return (
        <S.TransactionModalAction>
          <SubmitButton label="Close" type="button" onClick={() => props.close()} />
        </S.TransactionModalAction>
      );
    }

    return null;
  }, [started, finished, errored, prices.loading]);

  return (
    <S.TransactionModalForm onSubmit={submit}>
      <FormContext {...form}>
        {prepared && !prices.loading && (
          <>
            <S.EthGasStation>
              <S.EthGasStationButton
                type="button"
                onClick={() => set(prices.network!)}
                disabled={started || prices.network == null}
              >
                <S.EthGasStationButtonGwei>
                  {(prices.network && prices.network.toString()) || 'N/A'}
                </S.EthGasStationButtonGwei>
                <S.EthGasStationButtonText>Default</S.EthGasStationButtonText>
              </S.EthGasStationButton>
              <S.EthGasStationButton
                type="button"
                onClick={() => set(prices.slow!)}
                disabled={started || prices.slow == null}
              >
                <S.EthGasStationButtonGwei>
                  {(prices.slow && prices.slow.toString()) || 'N/A'}
                </S.EthGasStationButtonGwei>
                <S.EthGasStationButtonText>Slow</S.EthGasStationButtonText>
              </S.EthGasStationButton>
              <S.EthGasStationButton
                type="button"
                onClick={() => set(prices.average!)}
                disabled={started || prices.average == null}
              >
                <S.EthGasStationButtonGwei>
                  {(prices.average && prices.average.toString()) || 'N/A'}
                </S.EthGasStationButtonGwei>
                <S.EthGasStationButtonText>Average</S.EthGasStationButtonText>
              </S.EthGasStationButton>
              <S.EthGasStationButton
                type="button"
                onClick={() => set(prices.fast!)}
                disabled={started || prices.fast == null}
              >
                <S.EthGasStationButtonGwei>
                  {(prices.fast && prices.fast.toString()) || 'N/A'}
                </S.EthGasStationButtonGwei>
                <S.EthGasStationButtonText>Fast</S.EthGasStationButtonText>
              </S.EthGasStationButton>
            </S.EthGasStation>

            <S.TransactionModalFeeForm>
              <InputField
                disabled={started}
                id="gas-price"
                type="number"
                name="gasPrice"
                label="Gas Price (GWEI)"
                step=".01"
                defaultValue={price?.toString()}
              />

              {props.transaction.options?.gas && <div>Gas limit: {props.transaction.options.gas}</div>}
              {props.transaction.options?.incentive && (
                <div>Incentive: {props.transaction.options.incentive.toFixed(4)}</div>
              )}
              {props.transaction.options?.amgu && <div>AMGU: {props.transaction.options.amgu.toFixed(4)}</div>}
            </S.TransactionModalFeeForm>
          </>
        )}

        {received && (
          <S.TransactionModalMessages>
            <S.TransactionModalMessagesTable>
              <S.TransactionModalMessagesTableBody>
                {hash && (
                  <S.TransactionModalMessagesTableRow>
                    <S.TransactionModalMessagesTableRowLabel>Hash</S.TransactionModalMessagesTableRowLabel>
                    <S.TransactionModalMessagesTableRowQuantity>
                      <a target="_blank" href={etherscan!}>
                        {hash}
                      </a>
                    </S.TransactionModalMessagesTableRowQuantity>
                  </S.TransactionModalMessagesTableRow>
                )}
                {receipt && (
                  <S.TransactionModalMessagesTableRow>
                    <S.TransactionModalMessagesTableRowLabel>Block number</S.TransactionModalMessagesTableRowLabel>
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

        <S.TransactionModalActions>{actions}</S.TransactionModalActions>
      </FormContext>
    </S.TransactionModalForm>
  );
};
