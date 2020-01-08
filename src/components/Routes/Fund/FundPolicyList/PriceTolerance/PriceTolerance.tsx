import React from 'react';
import { PriceTolerancePolicy } from '~/queries/FundPolicies';
import { BodyCell } from '~/components/Common/Table/Table.styles';

interface PriceToleranceProps {
  policy: PriceTolerancePolicy;
}

export const PriceTolerance: React.FC<PriceToleranceProps> = ({ policy }) => {
  return <BodyCell>{policy.priceTolerance.dividedBy('1e16').toString()}%</BodyCell>;
};
