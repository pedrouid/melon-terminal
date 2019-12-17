import React from 'react';

import { Spinner } from '~/components/Common/Spinner/Spinner';
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
} from '~/components/Common/Table/Table.styles';

export interface FundInvestmentHistoryListProps {
  address: string;
}

export const FundInvestmentHistoryList: React.FC<FundInvestmentHistoryListProps> = ({ address }) => {
  const [fundInvestement, investementQuery] = useFundInvestmentHistory(address);

  if (investementQuery.loading) {
    return <Spinner positioning="centered" />;
  }

  if (!fundInvestement || !fundInvestement.length) {
    return <NoEntries>No entries.</NoEntries>;
  }

  return (
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
              <BodyCell>{new Date(investement.timestamp * 1000).toLocaleString()}</BodyCell>
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
  );
};
