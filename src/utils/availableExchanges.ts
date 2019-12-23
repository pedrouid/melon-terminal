import { Deployment, ExchangeDefinition } from '~/types';

export function availableExchanges(deployment: Deployment): ExchangeDefinition[] {
  const exchanges = [
    {
      name: 'MelonEngine',
      exchange: deployment.melon.addr.Engine,
      adapter: deployment.melon.addr.EngineAdapter,
    },
    {
      name: 'KyberNetwork',
      adapter: deployment.melon.addr.KyberAdapter,
      exchange: deployment.kyber.addr.KyberNetwork,
    },
    {
      name: 'OasisDex',
      adapter: deployment.melon.addr.OasisDexAdapter,
      exchange: deployment.oasis.addr.OasisDexExchange,
    },
    {
      name: 'ZeroEx',
      adapter: deployment.melon.addr.ZeroExV2Adapter,
      exchange: deployment.zeroex.addr.ZeroExV2Exchange,
    },
  ];

  return exchanges;
}
