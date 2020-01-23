import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Orderbook, aggregatedOrderbook, OrderbookItem } from './utils/aggregatedOrderbook';
import * as Rx from 'rxjs';
import * as S from './FundOrderbook.styles';
import { TokenDefinition, ExchangeDefinition } from '@melonproject/melonjs';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import BigNumber from 'bignumber.js';
import { FundOrderbookPrice } from './FundOrderbookPrice';

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

  const bestAsk = useMemo(() => {
    return orders?.asks[orders.asks.length - 1];
  }, [orders]);

  const bestBid = useMemo(() => {
    return orders?.bids[0];
  }, [orders]);

  const midPrice = useMemo(() => {
    const askPrice = bestAsk?.price ?? new BigNumber('NaN');
    const bidPrice = bestBid?.price ?? new BigNumber('NaN');
    return askPrice?.plus(bidPrice).dividedBy(2);
  }, [bestAsk, bestBid]);

  const toggle = useCallback(
    (order: OrderbookItem) => {
      if (props.selected?.id === order.id) {
        return props.setSelected(undefined);
      }

      props.setSelected(order);
    },
    [props.selected, props.setSelected]
  );

  const decimals = orders?.decimals ?? 8;

  return (
    <S.Wrapper>
      <S.OrderbookSide side="asks">
        <S.OrderbookHeader>
          <S.OrderbookLabel left={true} width={'auto'}>
            Price
          </S.OrderbookLabel>
          <S.OrderbookLabel>Quantity</S.OrderbookLabel>
          <S.OrderbookLabel>Total</S.OrderbookLabel>
        </S.OrderbookHeader>

        <S.OrderbookBody>
          {(orders?.asks ?? []).map(item => (
            <S.OrderbookItem key={item.id} selected={item.id === props.selected?.id} onClick={() => toggle(item)}>
              <S.OrderbookData left={true} width={'auto'}>
                <FundOrderbookPrice price={item.price} decimals={orders?.decimals} change={item.change} />
              </S.OrderbookData>
              <S.OrderbookData>{item.quantity.toFixed(4)}</S.OrderbookData>
              <S.OrderbookData>{item.total!.toFixed(4)}</S.OrderbookData>
            </S.OrderbookItem>
          ))}
        </S.OrderbookBody>
      </S.OrderbookSide>

      <S.OrderbookMidprice>
        {!midPrice.isNaN() ? <FormattedNumber value={midPrice} suffix={maker.symbol} /> : null}
      </S.OrderbookMidprice>

      <S.OrderbookSide side="bids">
        <S.OrderbookBody>
          {(orders?.bids ?? []).map(item => (
            <S.OrderbookItem key={item.id} selected={item.id === props.selected?.id} onClick={() => toggle(item)}>
              <S.OrderbookData left={true} width={'auto'}>
                <FundOrderbookPrice price={item.price} decimals={orders?.decimals} change={item.change} />
              </S.OrderbookData>
              <S.OrderbookData>{item.quantity.toFixed(4)}</S.OrderbookData>
              <S.OrderbookData>{item.total!.toFixed(4)}</S.OrderbookData>
            </S.OrderbookItem>
          ))}
        </S.OrderbookBody>
      </S.OrderbookSide>
    </S.Wrapper>
  );
};
