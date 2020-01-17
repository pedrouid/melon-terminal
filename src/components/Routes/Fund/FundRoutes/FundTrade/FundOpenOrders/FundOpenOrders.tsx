import React from 'react';
import { sameAddress } from '@melonproject/melonjs';
import { useFundOpenMakeOrdersQuery } from '~/queries/FundOpenMakeOrders';
import OpenOrderItem from './OpenOrderItem/OpenOrderItem';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { Table, HeaderCell, HeaderCellRightAlign, HeaderRow, NoEntries } from '~/storybook/components/Table/Table';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { useAccount } from '~/hooks/useAccount';
import { useFund } from '~/hooks/useFund';

export interface FundOpenOrdersProps {
  address: string;
}

export const FundOpenOrders: React.FC<FundOpenOrdersProps> = ({ address }) => {
  const [orders, query] = useFundOpenMakeOrdersQuery(address);
  const account = useAccount();
  const fund = useFund();

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Open orders</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  const isManager = sameAddress(fund.manager, account.address);

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
              {isManager && <HeaderCell>Status</HeaderCell>}
            </HeaderRow>
          </thead>
          <tbody>
            {orders.map(order => {
              return (
                <OpenOrderItem manager={isManager} address={address} order={order} key={order.orderIndex?.toString()} />
              );
            })}
          </tbody>
        </Table>
      ) : (
        <NoEntries>No open orders.</NoEntries>
      )}
    </Block>
  );
};
