import React from 'react';

import * as S from '~/components/Routes/Home/FundOverview/FundOverviewChange/FundOverviewChange.styles';

type CardProps = {
  prefix: number;
  dailyReturn: number;
  color: 'red' | 'green' | 'grey';
};

export const FundOverviewChange: React.FC<CardProps> = ({ prefix, dailyReturn, color }) => {
  return (
    <S.Color color={color}>
      {prefix}
      {dailyReturn.toFixed(2)}%
    </S.Color>
  );
};
