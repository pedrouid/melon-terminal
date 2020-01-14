import React from 'react';
import BigNumber from 'bignumber.js';

export interface FormattedNumberData {
  value?: BigNumber;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const FormattedNumber: React.FC<FormattedNumberData> = ({ value, prefix, suffix, decimals = 4 }) => {
  const bn = BigNumber.isBigNumber(val) ? value : new BigNumber(value ?? 'NaN');
  
  if (bn.isNaN()) {
    return <>N/A</>;
  }

  return <>{[prefix, bn.toFixed(decimals), suffix].join(' ')}</>;
};
