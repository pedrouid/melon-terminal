import BigNumber from 'bignumber.js';
import { toBigNumber } from '@melonproject/melonjs/utils/toBigNumber';

export function fromTokenBaseUnit(value: BigNumber | string | number, decimals: number): BigNumber {
  const val = toBigNumber(value ?? 'NaN');
  const dec = toBigNumber(decimals ?? 'NaN');

  if (typeof value === 'string' || typeof value === 'number') {
    value = new BigNumber(value);
  }

  return new BigNumber(value).dividedBy(new BigNumber(10).exponentiatedBy(decimals)).decimalPlaces(decimals);
}
