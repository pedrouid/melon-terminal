import React from 'react';
import * as S from './FundOrderbook.styles';

export interface FundOrderbookProps {
  address: string;
}

export const FundOrderbook: React.FC<FundOrderbookProps> = ({ address }) => {
  return (
    <S.Wrapper>
      <S.Title>Orderbook</S.Title>
      <p>empty</p>
    </S.Wrapper>
  );
};
