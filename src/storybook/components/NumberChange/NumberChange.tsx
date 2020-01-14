import React from 'react';
import BigNumber from 'bignumber.js';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import * as S from './NumberChange.styles';

type NumberChangeProps = {
  change: BigNumber;
};

export const NumberChange: React.FC<NumberChangeProps> = ({ change }) => {
  const color = change.isZero() ? 'grey' : change.isPositive() ? 'green' : 'red';

  return (
    <S.Color color={color}>
      <FormattedNumber value={change} decimals={2} suffix="%" />
    </S.Color>
  );
};
