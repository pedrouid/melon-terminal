import { useContext } from 'react';
import { CurrencyContext } from '~/components/Contexts/Currency/Currency';

export function useCurrency() {
  return useContext(CurrencyContext);
}
