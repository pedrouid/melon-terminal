import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { Tooltip } from '~/storybook/components/Tooltip/Tooltip';
import { numberWithCommas } from '~/utils/numberWithCommas';

export interface FormattedNumberData {
  value?: BigNumber | number | string | null;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  colorize?: boolean;
  tooltip?: boolean;
}

interface ColorProps {
  color: 'red' | 'green' | 'grey';
}

const NoWrap = styled.span`
  white-space: nowrap;
`;

const Color = styled(NoWrap)<ColorProps>`
  color: ${props => props.theme.otherColors[props.color]};
`;

export const FormattedNumber: React.FC<FormattedNumberData> = ({
  value,
  prefix,
  suffix,
  decimals = 4,
  colorize = false,
  tooltip = false,
}) => {
  const bn = BigNumber.isBigNumber(value) ? value : new BigNumber(value ?? 'NaN');
  const output = bn.isNaN()
    ? 'N/A'
    : [
        prefix,
        prefix ? ' ' : '',
        numberWithCommas(bn.toFixed(decimals)),
        (!suffix || suffix) === '%' ? '' : ' ',
        suffix,
      ];

  const bnFixed = bn.toFixed(18);

  if (colorize) {
    const color = bn.isNaN() || bn.isZero() ? 'grey' : bn.isPositive() ? 'green' : 'red';
    return (
      <Color color={color}>
        {tooltip ? (
          <Tooltip
            value={`${prefix ? ' ' : ''}${numberWithCommas(bnFixed)}${!suffix || suffix === '%' ? '' : ' '}${suffix}`}
          >
            {output}
          </Tooltip>
        ) : (
          output
        )}
      </Color>
    );
  }

  return (
    <NoWrap>
      {tooltip ? (
        <Tooltip
          value={`${prefix ? ' ' : ''}${numberWithCommas(bnFixed)}${!suffix || suffix === '%' ? '' : ' '}${suffix}`}
        >
          {output}
        </Tooltip>
      ) : (
        output
      )}
    </NoWrap>
  );
};
