import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Orderbook, aggregatedOrderbook, OrderbookItem } from './utils/aggregatedOrderbook';
import * as S from './FundOrderbook.styles';
import { TokenDefinition, ExchangeDefinition } from '@melonproject/melonjs';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import BigNumber from 'bignumber.js';
import { FundOrderbookPrice } from './FundOrderbookPrice';
import { Grid, GridCol, GridRow } from '~/storybook/components/Grid/Grid';

export interface FundOrderbookProps {
  exchanges: ExchangeDefinition[];
  setSelected: (order?: OrderbookItem) => void;
  selected?: OrderbookItem;
  asset?: TokenDefinition;
}

export const FundOrderbook: React.FC<FundOrderbookProps> = props => {
  const environment = useEnvironment()!;
  const [orders, setOrders] = useState<Orderbook>();

  const maker = useMemo(() => environment.getToken('WETH'), [environment]);
  const orderbook = aggregatedOrderbook(environment, props.exchanges, maker, props.asset);

  useEffect(() => {
    const subscription = orderbook.subscribe({
      next: orders => setOrders(orders),
    });

    return () => {
      subscription.unsubscribe();
    };
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
    <Grid fluid={true}>
      <GridRow noGap={true} justify="right">
        <GridCol align="right">Price</GridCol>
        <GridCol align="right">Quantity</GridCol>
        <GridCol align="right">Total</GridCol>
      </GridRow>
      <S.OrderbookSide side="asks">
        {(orders?.asks ?? []).map(item => (
          <S.OrderbookItem key={item.id} selected={item.id === props.selected?.id} onClick={() => toggle(item)}>
            <GridRow key={item.id} noGap={true} justify="right">
              <GridCol align="right">
                <FundOrderbookPrice price={item.price} decimals={orders?.decimals} change={item.change} />{' '}
              </GridCol>
              <GridCol align="right">
                <FormattedNumber value={item.quantity} />
              </GridCol>
              <GridCol align="right">
                <FormattedNumber value={item.total!} />
              </GridCol>
            </GridRow>
          </S.OrderbookItem>
        ))}
      </S.OrderbookSide>
      <GridRow>
        <S.OrderbookMidprice>
          MID: <FormattedNumber value={midPrice} decimals={decimals} />
        </S.OrderbookMidprice>
      </GridRow>
      <S.OrderbookSide side="bids">
        {(orders?.bids ?? []).map(item => (
          <S.OrderbookItem key={item.id} selected={item.id === props.selected?.id} onClick={() => toggle(item)}>
            <GridRow key={item.id} noGap={true}>
              <GridCol align="right">
                <FundOrderbookPrice price={item.price} decimals={orders?.decimals} change={item.change} />{' '}
              </GridCol>
              <GridCol align="right">
                <FormattedNumber value={item.quantity} />
              </GridCol>
              <GridCol align="right">
                <FormattedNumber value={item.total!} />
              </GridCol>
            </GridRow>
          </S.OrderbookItem>
        ))}
      </S.OrderbookSide>
    </Grid>
  );
};
