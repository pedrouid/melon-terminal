import BigNumber from 'bignumber.js';

export function calculateChangeFromSharePrice(current?: string, previous?: string): BigNumber {
  if (current != null && previous != null) {
    const bnCurrent = new BigNumber(current);
    const bnPrevious = new BigNumber(previous);

    return bnCurrent
      .dividedBy(bnPrevious)
      .minus(1)
      .multipliedBy(100);
  }
  return new BigNumber(0);
}
