import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Orderbook, aggregatedOrderbook, OrderbookItem } from './utils/aggregatedOrderbook';
import * as Rx from 'rxjs';
import * as S from './FundOrderbook.styles';
import { TokenDefinition, ExchangeDefinition } from '@melonproject/melonjs';

export interface FundOrderbookProps {
  address: string;
  exchanges: ExchangeDefinition[];
  setSelected: (order?: OrderbookItem) => void;
  selected?: OrderbookItem;
  asset?: TokenDefinition;
}

export const FundOrderbook: React.FC<FundOrderbookProps> = props => {
  const environment = useEnvironment()!;
  const [orders, setOrders] = useState<Orderbook>();

  const maker = useMemo(() => environment.getToken('WETH'), [environment]);
  const orderbook = useMemo(() => {
    if (!(maker && props.asset)) {
      return Rx.EMPTY;
    }

    return aggregatedOrderbook(environment, maker, props.asset);
  }, [props.asset]);

  useEffect(() => {
    const subscription = orderbook.subscribe({
      next: orders => setOrders(orders),
    });

    return () => subscription.unsubscribe();
  }, [orderbook]);

  const bids = orders?.bids ?? [];
  const asks = orders?.asks ?? [];
  const toggle = useCallback(
    (order: OrderbookItem) => {
      if (props.selected?.id === order.id) {
        return props.setSelected(undefined);
      }

      props.setSelected(order);
    },
    [props.selected, props.setSelected]
  );

  return (
    <S.Wrapper>
      <S.Orderbook>
        <S.OrderbookSide side="bids">
          <S.OrderbookHeader>
            <S.OrderbookLabel>Quantity</S.OrderbookLabel>
            <S.OrderbookLabel>Total</S.OrderbookLabel>
            <S.OrderbookLabel>Price</S.OrderbookLabel>
          </S.OrderbookHeader>

          <S.OrderbookBody>
            <S.OrderbookBarsWrapper>
              <S.OrderbookBars height={bids.length * 20}>
                {bids.map((item, index) => (
                  <S.OrderbookBar key={index} x="0" y={index * 20} width={`${item.relative!}%`} />
                ))}
              </S.OrderbookBars>
            </S.OrderbookBarsWrapper>

            {bids.map((item, index) => (
              <S.OrderbookItem key={index} selected={item.id === props.selected?.id} onClick={() => toggle(item)}>
                <S.OrderbookData>{item.quantity.toFixed(4)}</S.OrderbookData>
                <S.OrderbookData>{item.total!.toFixed(4)}</S.OrderbookData>
                <S.OrderbookData>{item.price.toFixed(4)}</S.OrderbookData>
              </S.OrderbookItem>
            ))}
          </S.OrderbookBody>
        </S.OrderbookSide>

        <S.OrderbookSide side="asks">
          <S.OrderbookHeader>
            <S.OrderbookLabel>Price</S.OrderbookLabel>
            <S.OrderbookLabel>Total</S.OrderbookLabel>
            <S.OrderbookLabel>Quantity</S.OrderbookLabel>
          </S.OrderbookHeader>

          <S.OrderbookBody>
            <S.OrderbookBarsWrapper>
              <S.OrderbookBars>
                {asks.map((item, index) => (
                  <S.OrderbookBar key={index} x="0" y={index * 20} width={`${item.relative!}%`} />
                ))}
              </S.OrderbookBars>
            </S.OrderbookBarsWrapper>

            {asks.map((item, index) => (
              <S.OrderbookItem key={index} selected={item.id === props.selected?.id} onClick={() => toggle(item)}>
                <S.OrderbookData>{item.price.toFixed(4)}</S.OrderbookData>
                <S.OrderbookData>{item.total!.toFixed(4)}</S.OrderbookData>
                <S.OrderbookData>{item.quantity.toFixed(4)}</S.OrderbookData>
              </S.OrderbookItem>
            ))}
          </S.OrderbookBody>
        </S.OrderbookSide>
      </S.Orderbook>
    </S.Wrapper>
  );
};
