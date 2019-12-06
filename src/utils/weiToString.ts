import BigNumber from 'bignumber.js';
import { fromWei } from 'web3-utils';

export function weiToString(value: string, fixed: number = 0): string {
  return new BigNumber(fromWei(value)).toFixed(fixed);
}
