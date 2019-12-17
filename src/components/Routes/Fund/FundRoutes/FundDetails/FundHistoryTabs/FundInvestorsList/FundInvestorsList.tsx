import React from 'react';

import { Spinner } from '~/components/Common/Spinner/Spinner';
import { useFundInvestments } from '~/queries/FundInvestments';
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

export interface FundInvestorsListProps {
  address: string;
}

export const FundInvestorsList: React.FC<FundInvestorsListProps> = ({ address }) => {
  const [fundInvestements, investementQuery] = useFundInvestments(address);

  if (investementQuery.loading) {
    return <Spinner positioning="centered" />;
  }

  if (!fundInvestements || !fundInvestements.length) {
    return <NoEntries>No entries.</NoEntries>;
  }

  return (
    <Table>
      <thead>
        <HeaderRow>
          <HeaderCell>Time</HeaderCell>
          <HeaderCellRightAlign>Shares</HeaderCellRightAlign>
        </HeaderRow>
      </thead>
      <tbody>
        {fundInvestements.map(investement => {
          return (
            <BodyRow key={investement.id}>
              <BodyCell>{investement.owner.id}</BodyCell>
              <BodyCellRightAlign>{weiToString(investement.shares.toString(), 4)}</BodyCellRightAlign>
            </BodyRow>
          );
        })}
      </tbody>
    </Table>
  );
};
