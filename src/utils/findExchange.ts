import { Deployment, ExchangeConfig } from '~/types';
import { sameAddress } from '@melonproject/melonjs/utils/sameAddress';

export interface NamedExchangeConfig extends ExchangeConfig {
  name: string;
}

export function findExchange(deployment: Deployment, which: string): NamedExchangeConfig | undefined {
  const names = Object.keys(deployment.exchangeConfigs);
  const exchanges: NamedExchangeConfig[] = Object.values(deployment.exchangeConfigs).map((item, index) => ({
    ...item,
    name: names[index],
  }));

  const address = which.startsWith('0x');
  return exchanges.find(item => {
    if (address && sameAddress(which, item.exchange)) {
      return true;
    }

    if (!address && which === item.name) {
      return true;
    }

    return false;
  });
}
