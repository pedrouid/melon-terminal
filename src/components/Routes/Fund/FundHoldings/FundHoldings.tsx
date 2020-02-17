import React from 'react';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { useFundHoldingsQuery } from './FundHoldings.query';
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
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { Icons, IconName } from '~/storybook/components/Icons/Icons';
import { TokenValue } from '~/components/Common/TokenValue/TokenValue';

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
    return acc.plus(current.value || new BigNumber(0));
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
              <HeaderCellRightAlign>Value [ETH]</HeaderCellRightAlign>
              <HeaderCellRightAlign>Allocation</HeaderCellRightAlign>
            </HeaderRow>
          </thead>
          <tbody>
            {holdings.map((holding, key) => (
              <BodyRow key={key}>
                <BodyCell>
                  <S.HoldingIcon>
                    <Icons name={holding.token?.symbol as IconName} size="small" />
                  </S.HoldingIcon>
                  <S.HoldingName>
                    <S.HoldingSymbol>{holding.token?.symbol}</S.HoldingSymbol>
                    <br />
                    <S.HoldingName>{holding.token?.name}</S.HoldingName>
                  </S.HoldingName>
                </BodyCell>
                <BodyCellRightAlign>
                  <FormattedNumber value={holding.token?.price} />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <TokenValue value={holding.amount!} decimals={holding.token!.decimals!} />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <TokenValue value={holding.value!} />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber value={holding.value?.dividedBy(totalValue).times(100)} decimals={2} suffix="%" />
                </BodyCellRightAlign>
              </BodyRow>
            ))}
          </tbody>
        </Table>
      </ScrollableTable>
    </Block>
  );
};
