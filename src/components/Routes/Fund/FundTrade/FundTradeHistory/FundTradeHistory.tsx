import React from 'react';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import {
  ScrollableTable,
  Table,
  HeaderCell,
  HeaderRow,
  BodyCell,
  BodyRow,
  NoEntries,
  HeaderCellRightAlign,
  BodyCellRightAlign,
} from '~/storybook/components/Table/Table';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { useFundTradeHistoryQuery } from './FundTradeHistory.query';
import { FormattedDate } from '~/components/Common/FormattedDate/FormattedDate';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { TokenValue } from '~/components/Common/TokenValue/TokenValue';

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
      {!query.loading && calls.length > 0 && (
        <ScrollableTable>
          <Table>
            <thead>
              <HeaderRow>
                <HeaderCell>Time</HeaderCell>
                <HeaderCell>Exchange</HeaderCell>
                <HeaderCell>Buy asset</HeaderCell>
                <HeaderCell>Sell asset</HeaderCell>
                <HeaderCellRightAlign>Buy quantity</HeaderCellRightAlign>
                <HeaderCellRightAlign>Sell quantity</HeaderCellRightAlign>
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
                  <BodyCellRightAlign>
                    <FormattedNumber tooltip={true} value={call.buyQuantity} suffix={call.buyAsset?.symbol} />
                  </BodyCellRightAlign>
                  <BodyCellRightAlign>
                    <FormattedNumber tooltip={true} value={call.sellQuantity} suffix={call.sellAsset?.symbol} />
                  </BodyCellRightAlign>
                  <BodyCell>{call.signature?.label}</BodyCell>
                </BodyRow>
              ))}
            </tbody>
          </Table>
        </ScrollableTable>
      )}
    </Block>
  );
};
