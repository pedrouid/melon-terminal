import React from 'react';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { Table, HeaderCell, HeaderRow, BodyCell, BodyRow, NoEntries } from '~/storybook/components/Table/Table';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { useFundTradeHistoryQuery } from './FundTradeHistory.query';
import { FormattedDate } from '~/components/Common/FormattedDate/FormattedDate';

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
              <HeaderCell>Buy asset</HeaderCell>
              <HeaderCell>Sell asset</HeaderCell>
              <HeaderCell>Buy quantity</HeaderCell>
              <HeaderCell>Sell quantity</HeaderCell>
              <HeaderCell>Order type</HeaderCell>
            </HeaderRow>
          </thead>
          <tbody>
            {calls.map(call => (
              <BodyRow key={call.id}>
                <BodyCell>
                  <FormattedDate timestamp={call.timestamp} />
                </BodyCell>
                <BodyCell>{call.exchange?.name}</BodyCell>
                <BodyCell>{call.buyAsset?.symbol}</BodyCell>
                <BodyCell>{call.sellAsset?.symbol}</BodyCell>
                <BodyCell>{call.buyQuantity?.toFixed(4)}</BodyCell>
                <BodyCell>{call.sellQuantity?.toFixed(4)}</BodyCell>
                <BodyCell>{call.signature?.label}</BodyCell>
              </BodyRow>
            ))}
          </tbody>
        </Table>
      )}
    </Block>
  );
};
