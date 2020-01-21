import React from 'react';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { useFundHoldingsQuery } from '~/queries/FundHoldings';
import * as S from './FundHoldings.styles';
import BigNumber from 'bignumber.js';
import {
  ScrollableTable,
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
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';

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

  const totalValue = holdings.reduce((acc, current) => {
    return acc.plus(current.valueInDenominationAsset || new BigNumber(0));
  }, new BigNumber(0));

  return (
    <Block>
      <SectionTitle>Portfolio holdings</SectionTitle>
      <ScrollableTable>
        <Table>
          <thead>
            <HeaderRow>
              <HeaderCell>Asset</HeaderCell>
              <HeaderCellRightAlign>Price</HeaderCellRightAlign>
              <HeaderCellRightAlign>Balance</HeaderCellRightAlign>
              <HeaderCellRightAlign>Value in ETH</HeaderCellRightAlign>
              <HeaderCellRightAlign>% allocation</HeaderCellRightAlign>
            </HeaderRow>
          </thead>
          <tbody>
            {holdings.map(holding => (
              <BodyRow key={holding.token?.address}>
                <BodyCell>
                  <S.HoldingSymbol>{holding.token?.symbol}</S.HoldingSymbol>
                  <br />
                  <S.HoldingName>{holding.token?.name}</S.HoldingName>
                </BodyCell>
                <BodyCellRightAlign>
                  <FormattedNumber value={holding.token?.price} />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber value={holding.amount?.dividedBy('1e18').toFixed(4)} />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber value={holding.valueInDenominationAsset?.dividedBy('1e18').toFixed(4)} />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber
                    value={holding.valueInDenominationAsset?.dividedBy(totalValue).times(100)}
                    decimals={2}
                    suffix="%"
                  />
                </BodyCellRightAlign>
              </BodyRow>
            ))}
          </tbody>
        </Table>
      </ScrollableTable>
    </Block>
  );
};
