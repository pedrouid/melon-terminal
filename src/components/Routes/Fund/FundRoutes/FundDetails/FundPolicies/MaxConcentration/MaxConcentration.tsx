import React from 'react';
import { MaxConcentrationPolicy } from '~/queries/FundPolicies';
import { BodyCell } from '~/components/Common/Table/Table.styles';

interface MaxConcentrationProps {
  policy: MaxConcentrationPolicy;
}

export const MaxConcentration: React.FC<MaxConcentrationProps> = ({ policy }) => {
  return <BodyCell>{policy.maxConcentration.dividedBy('1e16').toString()}%</BodyCell>;
};
