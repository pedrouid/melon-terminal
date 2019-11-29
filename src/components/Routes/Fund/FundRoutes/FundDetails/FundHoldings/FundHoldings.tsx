import React from 'react';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { useFundHoldingsQuery } from '~/queries/FundHoldings';
import * as S from './FundHoldings.styles';
import BigNumber from 'bignumber.js';

export interface FundHoldingsProps {
  address: string;
}

export const FundHoldings: React.FC<FundHoldingsProps> = ({ address }) => {
  const [holdings, query] = useFundHoldingsQuery(address);
  if (query.loading) {
    return <Spinner positioning="centered" />;
  }

  if (!holdings) {
    return null;
  }

  const holdingsDisplay =
    holdings &&
    holdings.map(holding => {
      return {
        ...holding,
        amountDivided: holding.amount.dividedBy(new BigNumber(10).exponentiatedBy(holding.token.decimals)),
      };
    });

  return (
    <>
      <h1>Holdings</h1>
      <S.Table>
        <thead>
          <S.HeaderRow>
            <S.HeaderCell>Asset</S.HeaderCell>
            <S.HeaderCell>Price</S.HeaderCell>
            <S.HeaderCell>Balance</S.HeaderCell>
          </S.HeaderRow>
        </thead>
        <tbody>
          {holdingsDisplay.map(holding => (
            <S.BodyRow key={holding.token.address}>
              <S.BodyCell>
                {holding.token.symbol} ({holding.token.name})
              </S.BodyCell>
              <S.BodyCell>{holding.token.price.toFixed(4)}</S.BodyCell>
              <S.BodyCell>{holding.amountDivided.toFixed(4)}</S.BodyCell>
            </S.BodyRow>
          ))}
        </tbody>
      </S.Table>
    </>
  );
};

export default FundHoldings;
