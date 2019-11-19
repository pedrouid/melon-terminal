import React from 'react';
import FundHoldings from './FundHoldings/FundHoldings';
import FundPolicies from './FundPolicies/FundPolicies';

export interface FundDetailsProps {
  address: string;
}

export const FundDetails: React.FC<FundDetailsProps> = ({ address }) => (
  <>
    <FundHoldings address={address} />
    <FundPolicies address={address} />
  </>
);

export default FundDetails;
