import React from 'react';
import * as S from './FundDetails.styles';
import FundHoldings from './FundHoldings/FundHoldings';
import FundPolicies from './FundPolicies/FundPolicies';
import FundOpenOrders from './FundOpenOrders/FundOpenOrders';
import FundOrderBook from './FundOrderBook/FundOrderBook';
import FundTrade from './FundTrade/FundTrade';

export interface FundDetailsProps {
  address: string;
}

export const FundDetails: React.FC<FundDetailsProps> = ({ address }) => (
  <S.FundDetailsContent>
    <S.FundDetailsOrder>
      <FundHoldings address={address} />
      <FundOrderBook address={address} />
      <FundTrade address={address} />
    </S.FundDetailsOrder>
    <S.FundDetailsLists>
      <FundPolicies address={address} />
      <FundOpenOrders address={address} />
    </S.FundDetailsLists>
  </S.FundDetailsContent>
);

export default FundDetails;
