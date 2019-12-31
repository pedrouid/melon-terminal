import React from 'react';
import * as S from './FundOrderbookTrading.styles';
import { FundOrderbook } from './FundOrderbook/FundOrderbook';
import { FundOrderbookForm } from './FundOrderbookForm/FundOrderbookForm';

export interface FundOrderbookTradingProps {
  address: string;
}

export const FundOrderbookTrading: React.FC<FundOrderbookTradingProps> = ({ address }) => {
  return (
    <S.Wrapper>
      <FundOrderbook address={address} />
      <FundOrderbookForm address={address} />
    </S.Wrapper>
  );
};
