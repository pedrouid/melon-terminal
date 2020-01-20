import BigNumber from 'bignumber.js';

export function toTokenBaseUnit(value: BigNumber | string | number | undefined, decimals: number = 18): BigNumber {
  if (!value) {
    return new BigNumber('NaN');
  }

  if (typeof value === 'string' || typeof value === 'number') {
    value = new BigNumber(value);
  }

  return new BigNumber(value).multipliedBy(new BigNumber(10).exponentiatedBy(decimals)).integerValue();
}
