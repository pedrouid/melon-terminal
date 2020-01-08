import React from 'react';
import { MaxPositionsPolicy } from '~/queries/FundPolicies';
import { BodyCell } from '~/components/Common/Table/Table.styles';

interface MaxPositionsProps {
  policy: MaxPositionsPolicy;
}

export const MaxPositions: React.FC<MaxPositionsProps> = ({ policy }) => {
  return <BodyCell>{policy.maxPositions}</BodyCell>;
};
