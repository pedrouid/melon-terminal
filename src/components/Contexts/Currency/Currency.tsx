import React, { useState, createContext, useEffect, useMemo } from 'react';

export const currencyList = ['ETH', 'USD', 'EUR', 'CHF'];

export enum CurrencyStatus {
  LOADING,
  SUCCESS,
  ERROR,
}

export interface Currency {
  symbol: string;
  rate?: number;
  time?: Date;
}

export interface CurrencyContext {
  status: CurrencyStatus;
  selected: Currency;
  list: Currency[];
  switch: (currency: string) => void;
}

export interface UseCoinAPIProps {
  base?: string;
  quote?: string;
}

export interface CoinAPIResult {
  time: Date;
  asset_id_base: string;
  asset_id_quote: string;
  rate: number;
}

export const Currency = createContext<CurrencyContext>({} as CurrencyContext);

export const CurrencyProvider: React.FC = props => {
  const [currency, setCurrency] = useState<string>('');
  const [coinApi, setcoinApi] = useState({ state: 'idle', data: {} as CoinAPIResult });

  useEffect(() => {
    setcoinApi({ state: 'LOADING', data: {} as CoinAPIResult });
    (async () => {
      try {
        const result = await fetch(`https://coinapi.melon.network/?base=ETH&quote=${currency || 'USD'}`);
        const json = (await result.json()) as CoinAPIResult;
        setcoinApi({ state: 'SUCCESS', data: json });
      } catch (e) {
        setcoinApi({ state: 'ERROR', data: {} as CoinAPIResult });
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

    return CurrencyStatus.ERROR;
  }, [coinApi.state]);

  const selected = useMemo(() => {
    return { symbol: currency, rate: coinApi.data.rate, time: coinApi.data.time };
  }, [currency, coinApi]);

  const list = currencyList.map(token => {
    return { symbol: token };
  }) as Currency[];

  const context: CurrencyContext = {
    status,
    selected,
    list,
    switch: currency => setCurrency(currency),
  };
  return <Currency.Provider value={context}>{props.children}</Currency.Provider>;
};
