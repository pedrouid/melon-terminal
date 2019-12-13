import React from 'react';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import * as S from './FundTradingHistory.styles';
import { useFundTradingHistoryQuery } from '~/queries/FundTradingHistory';
import BigNumber from 'bignumber.js';
import { tradingSignatureToName } from '~/utils/tradingSignatureToName';

export interface FundTradingHistoryProps {
  address: string;
}

export const FundTradingHistory: React.FC<FundTradingHistoryProps> = ({ address }) => {
  const [trades, query] = useFundTradingHistoryQuery(address);

  if (query.loading) {
    return <Spinner positioning="centered" />;
  }

  return (
    <S.Wrapper>
      <S.Title>Trading History</S.Title>
      {trades && trades.length > 0 ? (
        <S.Table>
          <thead>
            <S.HeaderRow>
              <S.HeaderCell>Time</S.HeaderCell>
              <S.HeaderCell>Maker Asset</S.HeaderCell>
              <S.HeaderCell>Taker Asset</S.HeaderCell>
              <S.HeaderCellRightAlign>Maker Asset Qty</S.HeaderCellRightAlign>
              <S.HeaderCellRightAlign>Taker Asset Qty</S.HeaderCellRightAlign>
              <S.HeaderCellRightAlign>Method</S.HeaderCellRightAlign>
            </S.HeaderRow>
          </thead>
          <tbody>
            {trades.map(trade => {
              const makerQty = new BigNumber(trade.orderValue0).dividedBy(
                new BigNumber(10).exponentiatedBy((trade.orderAddress2 && trade.orderAddress2.decimals) || 18)
              );
              const takerQty = new BigNumber(trade.orderValue1).dividedBy(
                new BigNumber(10).exponentiatedBy((trade.orderAddress3 && trade.orderAddress3.decimals) || 18)
              );
              const tradingSignature = tradingSignatureToName(trade.methodSignature);
              return (
                <S.BodyRow key={trade.id}>
                  <S.BodyCell>{new Date(trade.timestamp * 1000).toLocaleString()}</S.BodyCell>
                  <S.BodyCell>{trade.orderAddress2 && trade.orderAddress2.symbol}</S.BodyCell>
                  <S.BodyCell>{trade.orderAddress3 && trade.orderAddress3.symbol}</S.BodyCell>
                  <S.BodyCellRightAlign>{makerQty.toFixed(6)}</S.BodyCellRightAlign>
                  <S.BodyCellRightAlign>{takerQty.toFixed(6)}</S.BodyCellRightAlign>
                  <S.BodyCell>{tradingSignature}</S.BodyCell>
                </S.BodyRow>
              );
            })}
          </tbody>
        </S.Table>
      ) : (
        <S.NoRegisteredPolicies>No registered policies.</S.NoRegisteredPolicies>
      )}
    </S.Wrapper>
  );
};

export default FundTradingHistory;
