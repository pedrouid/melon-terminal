import React from 'react';
import * as S from './FundTrade.styles';

export interface FundTradeProps {
  address: string;
}

export const FundTrade: React.FC<FundTradeProps> = () => {
  return <S.FundTradeBody>Placeholder</S.FundTradeBody>;
};

export default FundTrade;
