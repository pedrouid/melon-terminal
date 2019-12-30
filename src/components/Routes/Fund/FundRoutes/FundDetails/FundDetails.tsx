import React from 'react';
import FundHoldings from './FundHoldings/FundHoldings';
import FundPolicies from './FundPolicies/FundPolicies';
import * as S from './FundDetails.styles';

export interface FundDetailsProps {
  address: string;
}

export const FundDetails: React.FC<FundDetailsProps> = ({ address }) => (
  <S.FundDetailsBody>
    <FundHoldings address={address} />
    <FundPolicies address={address} />
  </S.FundDetailsBody>
);

export default FundDetails;
