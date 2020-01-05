import React, { useState, useEffect } from 'react';
import { TokenDefinition, ExchangeDefinition } from '@melonproject/melonjs';
import { FundOrderbook } from './FundOrderbook/FundOrderbook';
import { FundOrderbookForm } from './FundOrderbookForm/FundOrderbookForm';
import { OrderbookItem } from './FundOrderbook/utils/aggregatedOrderbook';
import * as S from './FundOrderbookTrading.styles';

export interface FundOrderbookTradingProps {
  address: string;
  exchanges: ExchangeDefinition[];
  asset?: TokenDefinition;
}

export const FundOrderbookTrading: React.FC<FundOrderbookTradingProps> = props => {
  const [order, setOrder] = useState<OrderbookItem>();
  useEffect(() => setOrder(undefined), [props.asset]);

  return (
    <S.FundOrderbookTrading>
      <S.FundOrderbook>
        <FundOrderbook
          address={props.address}
          asset={props.asset}
          exchanges={props.exchanges}
          selected={order}
          setSelected={setOrder}
        />
      </S.FundOrderbook>
      <S.FundOrderbookForm>
        <FundOrderbookForm address={props.address} asset={props.asset} exchanges={props.exchanges} order={order} />
      </S.FundOrderbookForm>
    </S.FundOrderbookTrading>
  );
};
