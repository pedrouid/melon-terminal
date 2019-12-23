import { Deployment } from '~/types';
import { sameAddress } from '@melonproject/melonjs/utils/sameAddress';
import { availableExchanges } from './availableExchanges';

export function findExchange(deployment: Deployment, which: string) {
  const exchanges = availableExchanges(deployment);
  const address = which.startsWith('0x');
  return exchanges.find(item => {
    if (address && sameAddress(which, item.exchange)) {
      return true;
    }

    if (which === item.name) {
      return true;
    }

    return false;
  });
}
