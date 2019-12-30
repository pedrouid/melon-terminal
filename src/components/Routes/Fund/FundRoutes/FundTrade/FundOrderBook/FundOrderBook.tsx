import React from 'react';
import * as S from './FundOrderBook.styles';

export interface FundOrderBookProps {
  address: string;
}

export const FundOrderBook: React.FC<FundOrderBookProps> = ({ address }) => {
  return (
    <S.Wrapper>
      <S.Title>Order Book</S.Title>
      <p>empty</p>
    </S.Wrapper>
  );
};
