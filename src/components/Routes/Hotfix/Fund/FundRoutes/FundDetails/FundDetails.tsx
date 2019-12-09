import React from 'react';
import * as S from './FundDetails.styles';
import FundOpenOrders from './FundOpenOrders/FundOpenOrders';

export interface FundDetailsProps {
  address: string;
}

export const FundDetails: React.FC<FundDetailsProps> = ({ address }) => (
  <S.FundDetailsContent>
    <S.FundDetailsLists>
      <FundOpenOrders address={address} />
    </S.FundDetailsLists>
  </S.FundDetailsContent>
);

export default FundDetails;
