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
import * as S from './FundInvestorsList.styles';

export interface FundInvestorsListProps {
  address: string;
}

export const FundInvestorsList: React.FC<FundInvestorsListProps> = ({ address }) => {
  const [fundInvestements, investementQuery] = useFundInvestments(address);

  if (investementQuery.loading) {
    return (
      <S.Wrapper>
        <S.Title>Investors</S.Title>
        <Spinner />
      </S.Wrapper>
    );
  }

  if (!fundInvestements || !fundInvestements.length) {
    return (
      <S.Wrapper>
        <S.Title>Investors</S.Title>
        <NoEntries>No entries.</NoEntries>
      </S.Wrapper>
    );
  }

  return (
    <S.Wrapper>
      <S.Title>Investors</S.Title>
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
    </S.Wrapper>
  );
};
