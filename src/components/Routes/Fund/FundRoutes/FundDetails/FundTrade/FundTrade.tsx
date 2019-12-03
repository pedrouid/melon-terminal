import React from 'react';
import * as S from './FundTrade.styles';

export interface FundTradeProps {
  address: string;
}

export const FundTrade: React.FC<FundTradeProps> = ({ address }) => {
  return (
    <S.Wrapper>
      <S.Title>Trade</S.Title>
      <p>empty</p>
    </S.Wrapper>
  );
};

export default FundTrade;
