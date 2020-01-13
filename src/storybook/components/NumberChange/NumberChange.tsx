import React from 'react';
import BigNumber from 'bignumber.js';
import * as S from './NumberChange.styles';

type NumberChangeProps = {
  change: BigNumber;
};

export const NumberChange: React.FC<NumberChangeProps> = ({ change }) => {
  const color = change.isZero() ? 'grey' : change.isPositive() ? 'green' : 'red';

  return <S.Color color={color}>{change.toFixed(2)}%</S.Color>;
};
