import React from 'react';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { useFundInvestmentHistory } from '~/queries/FundTradingInvestmentsHistory';
import { weiToString } from '~/utils/weiToString';
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

export interface FundInvestmentHistoryListProps {
  address: string;
}

export const FundInvestmentHistoryList: React.FC<FundInvestmentHistoryListProps> = ({ address }) => {
  const [fundInvestement, investementQuery] = useFundInvestmentHistory(address);

  if (investementQuery.loading) {
    return (
      <Block>
        <SectionTitle>Investment history</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  if (!fundInvestement || !fundInvestement.length) {
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
            <HeaderCellRightAlign>Shares</HeaderCellRightAlign>
            <HeaderCellRightAlign>Shares Price</HeaderCellRightAlign>
            <HeaderCellRightAlign>Amount</HeaderCellRightAlign>
            <HeaderCell>Asset</HeaderCell>
            <HeaderCellRightAlign>Amount in ETH</HeaderCellRightAlign>
          </HeaderRow>
        </thead>
        <tbody>
          {fundInvestement.map(investement => {
            return (
              <BodyRow key={investement.id}>
                <BodyCell>
                  <FormattedDate timestamp={investement.timestamp} />
                </BodyCell>
                <BodyCell>{investement.owner.id.substr(0, 8)}...</BodyCell>
                <BodyCell>{investement.action}</BodyCell>
                <BodyCellRightAlign>{weiToString(investement.shares.toString(), 4)}</BodyCellRightAlign>
                <BodyCellRightAlign>{weiToString(investement.sharePrice.toString(), 4)}</BodyCellRightAlign>
                <BodyCellRightAlign>{weiToString(investement.amount.toString(), 4)}</BodyCellRightAlign>
                <BodyCell>{investement.asset.symbol}</BodyCell>
                <BodyCellRightAlign>{weiToString(investement.amount.toString(), 4)}</BodyCellRightAlign>
              </BodyRow>
            );
          })}
        </tbody>
      </Table>
    </Block>
  );
};
