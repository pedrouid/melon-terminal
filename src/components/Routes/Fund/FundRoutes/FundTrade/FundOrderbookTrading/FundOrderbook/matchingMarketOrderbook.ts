import * as Rx from 'rxjs';
import BigNumber from 'bignumber.js';
import { equals } from 'ramda';
import { APIOrder as ZeroExOrder } from '@0x/types';
import {
  TokenDefinition,
  DeployedEnvironment,
  MatchingMarketAccessor,
  MatchingMarketOrder,
} from '@melonproject/melonjs';
import { concatMap, expand, distinctUntilChanged, map } from 'rxjs/operators';
import { Orderbook, OrderbookItem, OrderType } from './aggregatedOrderbook';

export interface ZeroExOrderbookItem extends OrderbookItem {
  type: OrderType.ZeroEx;
  order: ZeroExOrder;
}

function mapOrders(orders: MatchingMarketOrder[], makerAsset: TokenDefinition, takerAsset: TokenDefinition) {
  const makerAssetDecimals = new BigNumber(10).exponentiatedBy(makerAsset.decimals);
  const takerAssetDecimals = new BigNumber(10).exponentiatedBy(takerAsset.decimals);

  return orders.map(order => {
    const type = OrderType.OasisDex;
    const quantity = order.buyQuantity.dividedBy(makerAssetDecimals);
    const price = order.sellQuantity.dividedBy(takerAssetDecimals).dividedBy(quantity);

    return {
      order,
      type,
      quantity,
      price,
      maker: makerAsset,
      taker: takerAsset,
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

  const delay$ = Rx.timer(10000);
  const bids$ = Rx.defer(() => contract.getOrders(exchange, makerAsset.address, takerAsset.address));
  const asks$ = Rx.defer(() => contract.getOrders(exchange, takerAsset.address, makerAsset.address));
  const orders$ = Rx.combineLatest(bids$, asks$);
  const polling$ = orders$.pipe(
    expand(() => delay$.pipe(concatMap(() => orders$))),
    distinctUntilChanged((a, b) => equals(a, b))
  );

  return polling$.pipe<Orderbook>(
    map(([b, a]) => ({
      bids: mapOrders(b, takerAsset, makerAsset),
      asks: mapOrders(a, makerAsset, takerAsset),
    }))
  );
}
