import React from 'react';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
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
import { useFundTradeHistoryQuery } from './FundTradeHistory.query';

export interface FundTradeHistoryProps {
  address: string;
}

export const FundTradeHistory: React.FC<FundTradeHistoryProps> = ({ address }) => {
  const [calls, query] = useFundTradeHistoryQuery(address);

  return (
    <Block>
      <SectionTitle>Trading history</SectionTitle>

      {query.loading && <Spinner />}
      {!query.loading && !calls.length && <NoEntries>No entries.</NoEntries>}
      {!query.loading && calls.length && (
        <Table>
          <thead>
            <HeaderRow>
              <HeaderCell>Time</HeaderCell>
              <HeaderCell>Exchange</HeaderCell>
              <HeaderCell>Maker asset</HeaderCell>
              <HeaderCell>Taker asset</HeaderCell>
            </HeaderRow>
          </thead>
          <tbody>
            {calls.map(call => (
              <BodyRow key={call.id}>
                <BodyCell>{call.timestamp}</BodyCell>
                <BodyCell>{call.exchange?.name}</BodyCell>
                <BodyCell>{call.makerAsset?.symbol}</BodyCell>
                <BodyCell>{call.takerAsset?.symbol}</BodyCell>
              </BodyRow>
            ))}
          </tbody>
        </Table>
      )}
    </Block>
  );
};
