import { NetworkEnum } from '~/types';
import { config } from '~/config';

export const networkFromId = (id?: number) => {
  if (id === 1 && !!config[NetworkEnum.MAINNET]) {
    return NetworkEnum.MAINNET;
  }

  if (id === 42 && !!config[NetworkEnum.KOVAN]) {
    return NetworkEnum.KOVAN;
  }

  if (id === 4 && !!config[NetworkEnum.TESTNET]) {
    return NetworkEnum.TESTNET;
  }
};
