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

  const holdingsDisplay =
    holdings &&
    holdings.map(holding => {
      return {
        ...holding,
        amountDivided: holding.amount.dividedBy(new BigNumber(10).exponentiatedBy(holding.token.decimals)),
      };
    });

  return (
    <S.Wrapper>
      <S.Title>Holdings</S.Title>
      <S.Table>
        <thead>
          <S.HeaderRow>
            <S.HeaderCell>Asset</S.HeaderCell>
            <S.HeaderCellRightAlign>Price</S.HeaderCellRightAlign>
            <S.HeaderCellRightAlign>Balance</S.HeaderCellRightAlign>
          </S.HeaderRow>
        </thead>
        <tbody>
          {holdingsDisplay &&
            holdingsDisplay.map(holding => (
              <S.BodyRow key={holding.token.address}>
                <S.BodyCell>
                  <S.HoldingSymbol>{holding.token.symbol}</S.HoldingSymbol>
                  <br />
                  <S.HoldingName>{holding.token.name}</S.HoldingName>
                </S.BodyCell>
                <S.BodyCellRightAlign>{holding.token.price.toFixed(4)}</S.BodyCellRightAlign>
                <S.BodyCellRightAlign>{holding.amountDivided.toFixed(4)}</S.BodyCellRightAlign>
              </S.BodyRow>
            ))}
        </tbody>
      </S.Table>
    </S.Wrapper>
  );
};

export default FundHoldings;
