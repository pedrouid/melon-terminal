import React from 'react';
import { MaxConcentrationPolicy } from '~/queries/FundPolicies';
import { BodyCell } from '~/storybook/components/Table/Table';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import BigNumber from 'bignumber.js';

interface MaxConcentrationProps {
  policy: MaxConcentrationPolicy;
}

export const MaxConcentration: React.FC<MaxConcentrationProps> = ({ policy }) => {
  return (
    <BodyCell>
      <FormattedNumber
        value={new BigNumber(policy.maxConcentration).dividedBy('1e18').multipliedBy(100)}
        decimals={0}
        suffix="%"
      />
    </BodyCell>
  );
};
