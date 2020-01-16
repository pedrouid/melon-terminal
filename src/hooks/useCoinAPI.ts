import { useMemo, useState, useEffect } from 'react';

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

export const useCoinAPI = (props?: UseCoinAPIProps) => {
  const [state, setState] = useState({ state: 'idle', data: {} as CoinAPIResult });

  useEffect(() => {
    setState({ state: 'loading', data: {} as CoinAPIResult });
    (async () => {
      try {
        const result = await fetch(
          `https://coinapi.melon.network/?base=${props?.base || 'ETH'}&quote=${props?.quote || 'USD'}`
        );
        const json = (await result.json()) as CoinAPIResult;
        setState({ state: 'success', data: json });
      } catch (e) {
        setState({ state: 'error', data: {} as CoinAPIResult });
      }
    })();
  }, [props]);

  return state;
};
