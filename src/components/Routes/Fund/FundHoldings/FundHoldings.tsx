import React from 'react';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { useFundHoldingsQuery } from '~/queries/FundHoldings';
import * as S from './FundHoldings.styles';
import BigNumber from 'bignumber.js';
import {
  Table,
  HeaderCell,
  HeaderCellRightAlign,
  BodyCell,
  BodyCellRightAlign,
  BodyRow,
  HeaderRow,
} from '~/storybook/components/Table/Table';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Block } from '~/storybook/components/Block/Block';

export interface FundHoldingsProps {
  address: string;
}

export const FundHoldings: React.FC<FundHoldingsProps> = ({ address }) => {
  const [holdings, query] = useFundHoldingsQuery(address);
  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Portfolio holdings</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  const mapped = holdings.map(holding => {
    const decimals = holding.token?.decimals;
    const amount = holding.amount;

    return {
      ...holding,
      // TODO: This should be done in the graphql api.
      divided: decimals && amount ? amount.dividedBy(new BigNumber(10).exponentiatedBy(decimals)) : new BigNumber(0),
    };
  });

  return (
    <Block>
      <SectionTitle>Portfolio holdings</SectionTitle>
      <Table>
        <thead>
          <HeaderRow>
            <HeaderCell>Asset</HeaderCell>
            <HeaderCellRightAlign>Price</HeaderCellRightAlign>
            <HeaderCellRightAlign>Balance</HeaderCellRightAlign>
          </HeaderRow>
        </thead>
        <tbody>
          {mapped.map(holding => (
            <BodyRow key={holding.token?.address}>
              <BodyCell>
                <S.HoldingSymbol>{holding.token?.symbol}</S.HoldingSymbol>
                <br />
                <S.HoldingName>{holding.token?.name}</S.HoldingName>
              </BodyCell>
              <BodyCellRightAlign>{holding.token?.price?.toFixed(4)}</BodyCellRightAlign>
              <BodyCellRightAlign>{holding.divided?.toFixed(4)}</BodyCellRightAlign>
            </BodyRow>
          ))}
        </tbody>
      </Table>
    </Block>
  );
};
