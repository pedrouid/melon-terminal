import React from 'react';
import { TokenDefinition } from '@melonproject/melonjs';
import * as S from './FundKyberTrading.styles';

export interface FundKyberTradingProps {
  address: string;
  asset?: TokenDefinition;
}

export const FundKyberTrading: React.FC<FundKyberTradingProps> = props => {
  return <S.FundKyberTrading>empty</S.FundKyberTrading>;
};
