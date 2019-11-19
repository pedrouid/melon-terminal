import React from 'react';
import * as S from './FundInvest.styles';

export interface InvestProps {
  address: string;
}

export const Invest: React.FC<InvestProps> = ({ address }) => {
  return (
    <S.FundInvestBody>
      <h1>Not yet implemented</h1>
    </S.FundInvestBody>
  );
};

export default Invest;
