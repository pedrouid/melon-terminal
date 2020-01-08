import * as Rx from 'rxjs';
import BigNumber from 'bignumber.js';
import { equals } from 'ramda';
import { Orderbook as OrderbookProvider } from '@0x/orderbook';
import { APIOrder as ZeroExOrder } from '@0x/types';
import { assetDataUtils } from '@0x/order-utils';
import { TokenDefinition, DeployedEnvironment, ExchangeIdentifier } from '@melonproject/melonjs';
import { concatMap, expand, distinctUntilChanged, map, catchError } from 'rxjs/operators';
import { NetworkEnum } from '~/types';
import { Orderbook, OrderbookItem } from './aggregatedOrderbook';

const endpoints = {
  [NetworkEnum.MAINNET]: {
    http: 'https://api.radarrelay.com/0x/v2/',
    ws: 'wss://ws.radarrelay.com/0x/v2',
  },
  [NetworkEnum.KOVAN]: {
    http: 'https://api.kovan.radarrelay.com/0x/v2/',
    ws: 'wss://api.kovan.radarrelay.com/0x/v2',
  },
} as {
  [key in NetworkEnum]: {
    http: string;
    ws: string;
  };
};

export interface ZeroExOrderbookItem extends OrderbookItem {
  type: ExchangeIdentifier.ZeroEx;
  order: ZeroExOrder;
}

function mapOrders(
  orders: ZeroExOrder[],
  makerAsset: TokenDefinition,
  takerAsset: TokenDefinition,
  side: 'bid' | 'ask'
) {
  const makerAssetDecimals = new BigNumber(10).exponentiatedBy(makerAsset.decimals);
  const takerAssetDecimals = new BigNumber(10).exponentiatedBy(takerAsset.decimals);

  return orders.map(order => {
    const quantity = order.order.makerAssetAmount.dividedBy(makerAssetDecimals);
    const price = order.order.takerAssetAmount.dividedBy(takerAssetDecimals).dividedBy(quantity);

    return {
      order,
      quantity,
      price,
      side,
      exchange: ExchangeIdentifier.ZeroEx,
      id: `zeroex:${order.order.salt}`,
    } as OrderbookItem;
  });
}

export function zeroExOrderbook(
  environment: DeployedEnvironment,
  makerAsset: TokenDefinition,
  takerAsset: TokenDefinition
) {
  const network = (environment.network as any) as NetworkEnum;
  const makerAssetData = assetDataUtils.encodeERC20AssetData(makerAsset.address);
  const takerAssetData = assetDataUtils.encodeERC20AssetData(takerAsset.address);

  if (!endpoints.hasOwnProperty(network)) {
    return Rx.EMPTY;
  }

  return Rx.using(
    () => {
      const provider = OrderbookProvider.getOrderbookForWebsocketProvider({
        httpEndpoint: endpoints[network].http,
        websocketEndpoint: endpoints[network].ws,
      });

      return {
        provider,
        unsubscribe: () => provider.destroyAsync(),
      };
    },
    resource => {
      const provider = (resource as any).provider as OrderbookProvider;

      const bids$ = Rx.defer(() => provider.getOrdersAsync(takerAssetData, makerAssetData)).pipe(
        catchError(() => Rx.of([]))
      );

      const asks$ = Rx.defer(() => provider.getOrdersAsync(makerAssetData, takerAssetData)).pipe(
        catchError(() => Rx.of([]))
      );

      const delay$ = Rx.timer(5000);
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
  );
}
