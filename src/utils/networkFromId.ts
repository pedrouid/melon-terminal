import { NetworkEnum } from '~/types';

export const networkFromId = (id?: number) => {
  if (id === 1) {
    return NetworkEnum.MAINNET;
  }

  if (id === 4) {
    return NetworkEnum.TESTNET;
  }

  if (id === 42) {
    return NetworkEnum.KOVAN;
  }
};
