import React from 'react';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { useFundInvestmentHistory } from '~/queries/FundTradingInvestmentsHistory';
import {
  Table,
  HeaderCell,
  HeaderCellRightAlign,
  HeaderRow,
  BodyCell,
  BodyCellRightAlign,
  BodyRow,
  NoEntries,
} from '~/storybook/components/Table/Table';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { FormattedDate } from '~/components/Common/FormattedDate/FormattedDate';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';

export interface FundInvestmentHistoryListProps {
  address: string;
}

export const FundInvestmentHistoryList: React.FC<FundInvestmentHistoryListProps> = ({ address }) => {
  const [fundInvestment, fundInvestmentQuery] = useFundInvestmentHistory(address);

  if (fundInvestmentQuery.loading) {
    return (
      <Block>
        <SectionTitle>Investment history</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  if (!fundInvestment || !fundInvestment.length) {
    return (
      <Block>
        <SectionTitle>Investment history</SectionTitle>
        <NoEntries>No entries.</NoEntries>
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Investment history</SectionTitle>
      <Table>
        <thead>
          <HeaderRow>
            <HeaderCell>Time</HeaderCell>
            <HeaderCell>Investor</HeaderCell>
            <HeaderCell>Action</HeaderCell>
            <HeaderCellRightAlign>Number of shares</HeaderCellRightAlign>
            <HeaderCellRightAlign>Share price</HeaderCellRightAlign>
            <HeaderCellRightAlign>Amount</HeaderCellRightAlign>
            <HeaderCell>Asset</HeaderCell>
            <HeaderCellRightAlign>Value in ETH</HeaderCellRightAlign>
          </HeaderRow>
        </thead>
        <tbody>
          {fundInvestment.map(investment => {
            return (
              <BodyRow key={investment.id}>
                <BodyCell>
                  <FormattedDate timestamp={investment.timestamp} />
                </BodyCell>
                <BodyCell>{investment.owner.id.substr(0, 8)}...</BodyCell>
                <BodyCell>{investment.action}</BodyCell>
                <BodyCellRightAlign>
                  <FormattedNumber value={fromTokenBaseUnit(investment.shares, 18)}></FormattedNumber>
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber value={fromTokenBaseUnit(investment.sharePrice, 18)}></FormattedNumber>
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber
                    value={fromTokenBaseUnit(investment.amount, investment.asset.decimals)}
                  ></FormattedNumber>
                </BodyCellRightAlign>
                <BodyCell>{investment.asset.symbol}</BodyCell>
                <BodyCellRightAlign>
                  <FormattedNumber
                    value={fromTokenBaseUnit(investment.amountInDenominationAsset, 18)}
                  ></FormattedNumber>
                </BodyCellRightAlign>
              </BodyRow>
            );
          })}
        </tbody>
      </Table>
    </Block>
  );
};
