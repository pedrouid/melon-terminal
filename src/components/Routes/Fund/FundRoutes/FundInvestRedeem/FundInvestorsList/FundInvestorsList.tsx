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
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';

export interface FundInvestorsListProps {
  address: string;
}

export const FundInvestorsList: React.FC<FundInvestorsListProps> = ({ address }) => {
  const [fundInvestements, investementQuery] = useFundInvestments(address);

  if (investementQuery.loading) {
    return (
      <Block>
        <SectionTitle>Investors</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  if (!fundInvestements || !fundInvestements.length) {
    return (
      <Block>
        <SectionTitle>Investors</SectionTitle>
        <NoEntries>No entries.</NoEntries>
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Investors</SectionTitle>
      <Table>
        <thead>
          <HeaderRow>
            <HeaderCell>Investor</HeaderCell>
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
    </Block>
  );
};
