import React from 'react';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { useFundHoldingsQuery } from '~/queries/FundHoldings';
import * as S from './FundHoldings.styles';
import BigNumber from 'bignumber.js';
import {
  Table,
  HeaderCell,
  HeaderCellRightAlign,
  BodyRowHover,
  BodyCell,
  BodyCellRightAlign,
  BodyRow,
  NoEntries,
} from '~/components/Common/Table/Table.styles';

export interface FundHoldingsProps {
  address: string;
}

export const FundHoldings: React.FC<FundHoldingsProps> = ({ address }) => {
  const [holdings, query] = useFundHoldingsQuery(address);
  if (query.loading) {
    return (
      <S.Wrapper>
        <S.Title>Holdings</S.Title>
        <Spinner positioning="centered" />
      </S.Wrapper>
    );
  }

  const mapped = (holdings || [])
    .filter(holding => holding && holding.token)
    .map(holding => {
      const decimals = holding.token.decimals;
      const amount = holding.amount;

      return {
        ...holding,
        divided: decimals && amount ? amount.dividedBy(new BigNumber(10).exponentiatedBy(decimals)) : new BigNumber(0),
      };
    });

  return (
    <S.Wrapper>
      <S.Title>Holdings</S.Title>
      <Table>
        <thead>
          <BodyRowHover>
            <HeaderCell>Asset</HeaderCell>
            <HeaderCellRightAlign>Price</HeaderCellRightAlign>
            <HeaderCellRightAlign>Balance</HeaderCellRightAlign>
          </BodyRowHover>
        </thead>
        <tbody>
          {mapped.map(holding => (
            <BodyRow key={holding.token.address}>
              <BodyCell>
                <S.HoldingSymbol>{holding.token.symbol}</S.HoldingSymbol>
                <br />
                <S.HoldingName>{holding.token.name}</S.HoldingName>
              </BodyCell>
              <BodyCellRightAlign>{holding.token.price.toFixed(4)}</BodyCellRightAlign>
              <BodyCellRightAlign>{holding.divided.toFixed(4)}</BodyCellRightAlign>
            </BodyRow>
          ))}
        </tbody>
      </Table>
    </S.Wrapper>
  );
};

export default FundHoldings;
