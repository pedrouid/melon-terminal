import React from 'react';
import * as S from './FundOpenOrders.styles';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useFundOpenMakeOrdersQuery } from '~/queries/FundOpenMakeOrders';
import OpenOrderItem from './OpenOrderItem/OpenOrderItem';
import { useFundDetailsQuery } from '~/queries/FundDetails';

export interface FundOpenOrdersProps {
  address: string;
}

export const FundOpenOrders: React.FC<FundOpenOrdersProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const [orders, query] = useFundOpenMakeOrdersQuery(address);

  return (
    <S.Wrapper>
      <S.Title>Open Orders</S.Title>
      {orders && orders.length > 0 ? (
        <S.Table>
          <thead>
            <S.HeaderRow>
              <S.HeaderCell>Asset</S.HeaderCell>
              <S.HeaderCell>Exchange</S.HeaderCell>
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

export default FundOpenOrders;
