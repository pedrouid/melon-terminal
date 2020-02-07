import React from 'react';
import BigNumber from 'bignumber.js';
import { FormattedNumber } from '../FormattedNumber/FormattedNumber';

export interface TokenValueProps {
  value?: BigNumber;
  symbol?: string;
  decimals?: number;
}

export const TokenValue: React.FC<TokenValueProps> = ({ value, symbol, decimals = 18 }) => {
  const bn = BigNumber.isBigNumber(value) ? value : new BigNumber(value ?? 'NaN');
  return <FormattedNumber value={bn.dividedBy(new BigNumber(10).exponentiatedBy(decimals))} suffix={symbol} />;
};
