import React, { useState, createContext, useEffect, useMemo } from 'react';

export const currencyList = ['ETH', 'USD', 'EUR', 'CHF'] as const;

export type CurrencySymbol = typeof currencyList[number];

export enum CurrencyStatus {
  INITIALIZED,
  LOADING,
  SUCCESS,
  ERROR,
}

export interface CurrencyRate {
  time: Date;
  asset_id_base: string;
  asset_id_quote: string;
  rate: number;
}

export interface Currency {
  symbol: CurrencySymbol;
  data?: CurrencyRate;
}

export interface CurrencyContext {
  current: Currency;
  status: CurrencyStatus;
  list: Currency[];
  switch: (currency: string) => void;
}

export interface UseCoinApiProps {
  base?: string;
  quote?: string;
}

export interface CoinApiState {
  state: string;
  data: CurrencyRate;
}

export const Currency = createContext<CurrencyContext>({} as CurrencyContext);

export const CurrencyProvider: React.FC = props => {
  const [currency, setCurrency] = useState<string>('ETH');
  const [coinApi, setcoinApi] = useState<CoinApiState>({} as CoinApiState);

  useEffect(() => {
    setcoinApi({ state: 'LOADING', data: {} as CurrencyRate });
    (async () => {
      try {
        const result = await fetch(`https://coinapi.melon.network/?base=ETH&quote=${currency || 'USD'}`);
        const json = (await result.json()) as CurrencyRate;
        setcoinApi({ state: 'SUCCESS', data: json });
      } catch (e) {
        setcoinApi({ state: 'ERROR', data: {} as CurrencyRate });
      }
    })();
  }, [currency]);

  const status = useMemo(() => {
    if (coinApi.state === 'SUCCESS') {
      return CurrencyStatus.SUCCESS;
    }

    if (coinApi.state === 'LOADING') {
      return CurrencyStatus.LOADING;
    }

    if (coinApi.state === 'ERROR') {
      return CurrencyStatus.ERROR;
    }

    return CurrencyStatus.INITIALIZED;
  }, [coinApi.state]);

  const current = useMemo(() => {
    return { symbol: currency, data: { rate: coinApi.data?.rate || 1, time: coinApi.data?.time || new Date() } };
  }, [currency, status]) as Currency;

  const list = currencyList.map(token => {
    return { symbol: token };
  }) as Currency[];

  const context: CurrencyContext = {
    status,
    current,
    list,
    switch: currency => setCurrency(currency),
  };
  return <Currency.Provider value={context}>{props.children}</Currency.Provider>;
};
