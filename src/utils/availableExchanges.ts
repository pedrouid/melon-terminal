import { Deployment, ExchangeDefinition } from '~/types';

export function availableExchanges(deployment: Deployment): ExchangeDefinition[] {
  const exchanges = [
    deployment.melon && {
      name: 'MelonEngine',
      exchange: deployment.melon.addr.Engine,
      adapter: deployment.melon.addr.EngineAdapter,
    },
    deployment.kyber && {
      name: 'KyberNetwork',
      adapter: deployment.melon.addr.KyberAdapter,
      exchange: deployment.kyber.addr.KyberNetworkProxy,
    },
    deployment.oasis && {
      name: 'OasisDex',
      adapter: deployment.melon.addr.MatchingMarketAdapter,
      exchange: deployment.oasis.addr.MatchingMarket,
    },
    deployment.zeroex && {
      name: 'ZeroEx',
      adapter: deployment.melon.addr.ZeroExV2Adapter,
      exchange: deployment.zeroex.addr.Exchange,
    },
  ];

  return exchanges.filter(value => !!value);
}
