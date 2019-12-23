import React, { useCallback } from 'react';
import * as S from './FundOpenOrders.styles';
import { useFundOpenMakeOrdersQuery } from '~/queries/FundOpenMakeOrders';
import OpenOrderItem from './OpenOrderItem/OpenOrderItem';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { Table, HeaderCell, HeaderCellRightAlign, HeaderRow, NoEntries } from '~/components/Common/Table/Table.styles';

export interface FundOpenOrdersProps {
  address: string;
}

export const FundOpenOrders: React.FC<FundOpenOrdersProps> = ({ address }) => {
  const [orders, query] = useFundOpenMakeOrdersQuery(address);
  const refresh = useCallback(async () => {
    await query.refetch();
  }, [query]);

  if (query.loading) {
    return (
      <S.Wrapper>
        <S.Title>Open Orders</S.Title>
        <Spinner positioning="centered" />
      </S.Wrapper>
    );
  }

  return (
    <S.Wrapper>
      <S.Title>Open Orders</S.Title>
      {orders && orders.length > 0 ? (
        <Table>
          <thead>
            <HeaderRow>
              <HeaderCell>Asset</HeaderCell>
              <HeaderCell>Exchange</HeaderCell>
              <HeaderCellRightAlign>Price</HeaderCellRightAlign>
              <HeaderCellRightAlign>Quantity</HeaderCellRightAlign>
              <HeaderCell>Expired</HeaderCell>
            </HeaderRow>
          </thead>
          <tbody>
            {orders.map(order => <OpenOrderItem address={address} order={order} refresh={refresh} key={order.orderIndex.toString()} />)}
          </tbody>
        </Table>
      ) : (
          <NoEntries>No open orders</NoEntries>
        )}
    </S.Wrapper>
  );
};
