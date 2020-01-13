import React from 'react';
import { MaxConcentrationPolicy } from '~/queries/FundPolicies';
import { BodyCell } from '~/storybook/components/Table/Table';

interface MaxConcentrationProps {
  policy: MaxConcentrationPolicy;
}

export const MaxConcentration: React.FC<MaxConcentrationProps> = ({ policy }) => {
  return <BodyCell>{policy.maxConcentration.dividedBy('1e16').toString()}%</BodyCell>;
};
