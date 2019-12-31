import React from 'react';
import * as S from './FundTrade.styles';
import { FundOpenOrders } from './FundOpenOrders/FundOpenOrders';
import { FundOrderbookTrading } from './FundOrderbookTrading/FundOrderbookTrading';

export interface FundTradeProps {
  address: string;
}

export const FundTrade: React.FC<FundTradeProps> = (props) => {
  return (
    <S.FundTradeBody>
      <FundOpenOrders address={props.address} />
      <FundOrderbookTrading address={props.address} />
    </S.FundTradeBody>
  );
};

export default FundTrade;
