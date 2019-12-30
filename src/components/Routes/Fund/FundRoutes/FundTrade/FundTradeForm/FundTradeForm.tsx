import React from 'react';
import * as S from './FundTradeForm.styles';

export interface FundTradeFormProps {
  address: string;
}

export const FundTradeForm: React.FC<FundTradeFormProps> = ({ address }) => {
  return (
    <S.Wrapper>
      <S.Title>Trade</S.Title>
      <p>empty</p>
    </S.Wrapper>
  );
};
