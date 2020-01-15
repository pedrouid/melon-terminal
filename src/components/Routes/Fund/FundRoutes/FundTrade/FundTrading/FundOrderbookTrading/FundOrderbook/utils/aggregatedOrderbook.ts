import * as Rx from 'rxjs';
import BigNumber from 'bignumber.js';
import { startWith } from 'rxjs/operators';
import { TokenDefinition, DeployedEnvironment, ExchangeIdentifier } from '@melonproject/melonjs';
// import { zeroExOrderbook } from './zeroExOrderbook';
import { matchingMarketOrderbook } from './matchingMarketOrderbook';

export interface OrderbookItem {
  id: string;
  order: any;
  price: BigNumber;
  quantity: BigNumber;
  side: 'bid' | 'ask';
  exchange: ExchangeIdentifier;
  total?: BigNumber;
  relative?: number;
}

export interface Orderbook {
  asks: OrderbookItem[];
  bids: OrderbookItem[];
}

export function aggregatedOrderbook(
  environment: DeployedEnvironment,
  makerAsset: TokenDefinition,
  takerAsset: TokenDefinition
) {
  const empty = {
    asks: [],
    bids: [],
  } as Orderbook;

  const streams = [
    // zeroExOrderbook(environment, makerAsset, takerAsset).pipe(startWith(empty)),
    matchingMarketOrderbook(environment, makerAsset, takerAsset).pipe(startWith(empty)),
  ];

  const merged$ = Rx.combineLatest(streams, (...groups) => {
    const empty = [] as OrderbookItem[];

    const asksOnly = groups.map(item => item.asks);
    const asksFlat = empty.concat
      .apply(empty, asksOnly)
      .sort((a, b) => a.price.comparedTo(b.price))
      .slice(0, 20);

    const asksQuantity = asksFlat.reduce((carry, current) => carry.plus(current.quantity), new BigNumber(0));
    const asks = asksFlat.reduce((carry, current, index) => {
      const previous = carry[index - 1]?.total ?? new BigNumber(0);
      const total = current.quantity.plus(previous);
      const relative = total
        .dividedBy(asksQuantity)
        .multipliedBy(100)
        .decimalPlaces(0)
        .toNumber();

      const item: OrderbookItem = {
        ...current,
        total,
        relative,
      };

      return [...carry, item];
    }, [] as OrderbookItem[]);

    const bidsOnly = groups.map(item => item.bids);
    const bidsFlat = empty.concat
      .apply(empty, bidsOnly)
      .sort((a, b) => b.price.comparedTo(a.price))
      .slice(0, 20);

    const bidsQuantity = bidsFlat.reduce((carry, current) => carry.plus(current.quantity), new BigNumber(0));
    const bids = bidsFlat.reduce((carry, current, index) => {
      const previous = carry[index - 1]?.total ?? new BigNumber(0);
      const total = current.quantity.plus(previous);
      const relative = total
        .dividedBy(bidsQuantity)
        .multipliedBy(100)
        .decimalPlaces(0)
        .toNumber();

      const item: OrderbookItem = {
        ...current,
        total,
        relative,
      };

      return [...carry, item];
    }, [] as OrderbookItem[]);

    return { asks, bids } as Orderbook;
  });

  return merged$;
}
