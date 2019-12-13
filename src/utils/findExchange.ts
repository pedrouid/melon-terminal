import { Deployment } from '~/types';
import { sameAddress } from '@melonproject/melonjs/utils/sameAddress';

export function findExchange(deployment: Deployment, which: string) {
  const exchanges = deployment.exchangeConfigs;
  const exchangeNames = Object.keys(exchanges);

  const address = which.startsWith('0x');

  const exchange = exchangeNames.find(name => {
    if (exchanges[name].exchange === which) {
      return true;
    }

    if (address && sameAddress(which, exchanges[name].exchange)) {
      return true;
    }

    return false;
  });

  return exchange && { ...exchanges[exchange], name: exchange };
}
