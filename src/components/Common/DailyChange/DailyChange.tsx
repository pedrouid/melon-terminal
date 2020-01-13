import React from 'react';
import BigNumber from 'bignumber.js';

import * as S from '~/components/Common/DailyChange/DailyChange.styles';

type DailyChangeProps = {
  change: BigNumber;
};

export const DailyChange: React.FC<DailyChangeProps> = ({ change }) => {
  const color = change.isZero() ? 'grey' : change.isPositive() ? 'green' : 'red';

  return <S.Color color={color}>{change.toFixed(2)}%</S.Color>;
};
