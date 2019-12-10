import { useState, useEffect } from 'react';

export interface EthGasStation {
  fast: number;
  low: number;
  average: number;
  state: EthGasStationState;
}

export enum EthGasStationState {
  LOADING,
  ERROR,
  SUCCESS,
}

export const useEthGasStation = (): EthGasStation => {
  const [gas, setGas] = useState<any>({
    fast: 0,
    low: 0,
    average: 0,
    error: undefined,
    state: EthGasStationState.LOADING,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetch('https://ethgasstation.info/json/ethgasAPI.json');
        const json = await result.json();

        setGas({
          fast: json.fast / 10,
          low: json.safeLow / 10,
          average: json.average / 10,
          error: undefined,
          state: EthGasStationState.SUCCESS,
        });
      } catch (error) {
        setGas({
          error,
          fast: 0,
          low: 0,
          average: 0,
          state: EthGasStationState.ERROR,
        });
      }
    }

    fetchData();
  }, []);

  return gas;
};
