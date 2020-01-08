import React from 'react';
import { useFundOpenMakeOrdersQuery } from '~/queries/FundOpenMakeOrders';
import OpenOrderItem from './OpenOrderItem/OpenOrderItem';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { Table, HeaderCell, HeaderCellRightAlign, HeaderRow, NoEntries } from '~/components/Common/Table/Table.styles';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';

export interface FundOpenOrdersProps {
  address: string;
}

export const FundOpenOrders: React.FC<FundOpenOrdersProps> = ({ address }) => {
  const [orders, query] = useFundOpenMakeOrdersQuery(address);

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Open orders</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Open orders</SectionTitle>
      {orders && orders.length ? (
        <Table>
          <thead>
            <HeaderRow>
              <HeaderCell>Maker asset</HeaderCell>
              <HeaderCell>Taker asset</HeaderCell>
              <HeaderCell>Exchange</HeaderCell>
              <HeaderCellRightAlign>Price</HeaderCellRightAlign>
              <HeaderCellRightAlign>Quantity</HeaderCellRightAlign>
              <HeaderCell>Status</HeaderCell>
            </HeaderRow>
          </thead>
          <tbody>
            {orders.map(order => {
              return <OpenOrderItem address={address} order={order} key={order.orderIndex?.toString()} />;
            })}
          </tbody>
        </Table>
      ) : (
          <NoEntries>No open orders</NoEntries>
        )}
    </Block>
  );
};
