import BigNumber from 'bignumber.js';
import { toBigNumber } from '@melonproject/melonjs';

export function toTokenBaseUnit(value: BigNumber | string | number | undefined, decimals: number): BigNumber {
  const val = toBigNumber(value ?? 'NaN');
  const dec = toBigNumber(decimals ?? 'NaN');

  if (typeof value === 'string' || typeof value === 'number') {
    value = new BigNumber(value);
  }

  return val.multipliedBy(new BigNumber(10).exponentiatedBy(dec)).integerValue();
}
