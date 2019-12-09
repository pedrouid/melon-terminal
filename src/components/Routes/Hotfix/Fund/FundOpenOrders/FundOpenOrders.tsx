import React from 'react';
import * as S from './FundOpenOrders.styles';
import { useFundOpenMakeOrdersQuery } from '~/queries/FundOpenMakeOrders';
import OpenOrderItem from './OpenOrderItem/OpenOrderItem';
import { Spinner } from '~/components/Common/Spinner/Spinner';

export interface FundOpenOrdersProps {
  address: string;
}

export const FundOpenOrders: React.FC<FundOpenOrdersProps> = ({ address }) => {
  const [orders, query] = useFundOpenMakeOrdersQuery(address);

  if (query.loading) {
    return (
      <S.Wrapper>
        <S.Title>Open orders</S.Title>
        <Spinner positioning="centered" />
      </S.Wrapper>
    );
  }

  return (
    <S.Wrapper>
      <S.Title>Open orders</S.Title>
      {orders && orders.length > 0 ? (
        <S.Table>
          <thead>
            <S.HeaderRow>
              <S.HeaderCell>Asset</S.HeaderCell>
              <S.HeaderCell>Type</S.HeaderCell>
              <S.HeaderCellRightAlign>Price</S.HeaderCellRightAlign>
              <S.HeaderCellRightAlign>Quantity</S.HeaderCellRightAlign>
              <S.HeaderCell>Expired</S.HeaderCell>
            </S.HeaderRow>
          </thead>
          <tbody>
            {orders.map(order => {
              return <OpenOrderItem address={address} order={order} key={order.orderIndex.toString()} />;
            })}
          </tbody>
        </S.Table>
      ) : (
        <S.NoOpenOrders>No open orders.</S.NoOpenOrders>
      )}
    </S.Wrapper>
  );
};
