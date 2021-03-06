import { NetworkEnum } from '~/types';
import { config } from '~/config';

export function networkFromId(id?: number): NetworkEnum | undefined {
  if (id === 1 && !!config[NetworkEnum.MAINNET]) {
    return NetworkEnum.MAINNET;
  }
  if (id === 4 && !!config[NetworkEnum.RINKEBY]) {
    return NetworkEnum.RINKEBY;
  }

  if (id === 42 && !!config[NetworkEnum.KOVAN]) {
    return NetworkEnum.KOVAN;
  }

  if (id === 4447 && !!config[NetworkEnum.TESTNET]) {
    return NetworkEnum.TESTNET;
  }

  return NetworkEnum.UNSUPPORTED;
}
