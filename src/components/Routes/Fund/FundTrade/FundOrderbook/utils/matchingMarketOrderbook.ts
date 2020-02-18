import * as Rx from 'rxjs';
import { equals } from 'ramda';
import {
  TokenDefinition,
  DeployedEnvironment,
  OasisDexAccessor,
  OasisDexOrder,
  ExchangeIdentifier,
} from '@melonproject/melonjs';
import { concatMap, expand, distinctUntilChanged, map, catchError } from 'rxjs/operators';
import { Orderbook, OrderbookItem } from './aggregatedOrderbook';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { useMemo } from 'react';

export interface OasisDexOrderbookItem extends OrderbookItem {
  type: ExchangeIdentifier.OasisDex;
  order: OasisDexOrder;
}

function mapOrders(
  orders: OasisDexOrder[],
  makerAsset: TokenDefinition,
  takerAsset: TokenDefinition,
  side: 'bid' | 'ask'
) {
  return orders.map(order => {
    const quantity =
      side === 'bid'
        ? fromTokenBaseUnit(order.buyQuantity, makerAsset.decimals)
        : fromTokenBaseUnit(order.sellQuantity, takerAsset.decimals);

    const price =
      side === 'bid'
        ? fromTokenBaseUnit(order.sellQuantity, takerAsset.decimals).dividedBy(quantity)
        : fromTokenBaseUnit(order.buyQuantity, makerAsset.decimals).dividedBy(quantity);

    return {
      order,
      quantity,
      price,
      side,
      exchange: ExchangeIdentifier.OasisDex,
      id: `matchingmarket:${order.id.toString()}`,
    } as OrderbookItem;
  });
}

export function matchingMarketOrderbook(
  active: boolean,
  environment: DeployedEnvironment,
  makerAsset: TokenDefinition,
  takerAsset?: TokenDefinition
) {
  return useMemo(() => {
    if (!(active && makerAsset && takerAsset)) {
      return Rx.EMPTY;
    }

    const exchange = environment.deployment.oasis.addr.OasisDexExchange;
    const contract = new OasisDexAccessor(environment, environment.deployment.melon.addr.OasisDexAccessor);

    const bids$ = Rx.defer(() => contract.getOrders(exchange, makerAsset.address, takerAsset.address)).pipe(
      catchError(() => Rx.of([]))
    );

    const asks$ = Rx.defer(() => contract.getOrders(exchange, takerAsset.address, makerAsset.address)).pipe(
      catchError(() => Rx.of([]))
    );

    const delay$ = Rx.timer(10000);
    const orders$ = Rx.combineLatest(bids$, asks$);
    const polling$ = orders$.pipe(
      expand(() => delay$.pipe(concatMap(() => orders$))),
      distinctUntilChanged((a, b) => equals(a, b))
    );

    return polling$.pipe<Orderbook>(
      map(([b, a]) => ({
        bids: mapOrders(b, makerAsset, takerAsset!, 'bid'),
        asks: mapOrders(a, takerAsset, makerAsset, 'ask'),
      }))
    );
  }, [active, environment, makerAsset, takerAsset]);
}
