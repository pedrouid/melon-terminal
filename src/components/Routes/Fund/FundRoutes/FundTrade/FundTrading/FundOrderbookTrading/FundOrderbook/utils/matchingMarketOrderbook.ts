import * as Rx from 'rxjs';
import BigNumber from 'bignumber.js';
import { equals } from 'ramda';
import {
  TokenDefinition,
  DeployedEnvironment,
  MatchingMarketAccessor,
  MatchingMarketOrder,
  ExchangeIdentifier,
} from '@melonproject/melonjs';
import { concatMap, expand, distinctUntilChanged, map, catchError } from 'rxjs/operators';
import { Orderbook, OrderbookItem } from './aggregatedOrderbook';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';

export interface MatchingMarketOrderbookItem extends OrderbookItem {
  type: ExchangeIdentifier.OasisDex;
  order: MatchingMarketOrder;
}

function mapOrders(
  orders: MatchingMarketOrder[],
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
  environment: DeployedEnvironment,
  makerAsset: TokenDefinition,
  takerAsset: TokenDefinition
) {
  const exchange = environment.deployment.oasis.addr.OasisDexExchange;
  const contract = new MatchingMarketAccessor(environment, environment.deployment.melon.addr.MatchingMarketAccessor);

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
      bids: mapOrders(b, takerAsset, makerAsset, 'bid'),
      asks: mapOrders(a, makerAsset, takerAsset, 'ask'),
    }))
  );
}
