import React from 'react';
import { TokenDefinition } from '@melonproject/melonjs';
import { FundOrderbook } from './FundOrderbook/FundOrderbook';
import { FundOrderbookForm } from './FundOrderbookForm/FundOrderbookForm';
import * as S from './FundOrderbookTrading.styles';

export interface FundOrderbookTradingProps {
  address: string;
  asset?: TokenDefinition;
}

export const FundOrderbookTrading: React.FC<FundOrderbookTradingProps> = props => {
  return (
    <S.FundOrderbookTrading>
      <S.FundOrderbook>
        <FundOrderbook address={props.address} asset={props.asset} />
      </S.FundOrderbook>
      <S.FundOrderbookForm>
        <FundOrderbookForm address={props.address} asset={props.asset} />
      </S.FundOrderbookForm>
    </S.FundOrderbookTrading>
  );
};
