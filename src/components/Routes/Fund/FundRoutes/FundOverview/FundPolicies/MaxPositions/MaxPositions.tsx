import React from 'react';
import { MaxPositionsPolicy } from '~/queries/FundPolicies';
import { BodyCell } from '~/storybook/components/Table/Table';

interface MaxPositionsProps {
  policy: MaxPositionsPolicy;
}

export const MaxPositions: React.FC<MaxPositionsProps> = ({ policy }) => {
  return <BodyCell>{policy.maxPositions}</BodyCell>;
};
