import { Deployment, TokenDefinition } from '~/types';

export function availableTokens(deployment: Deployment): TokenDefinition[] {
  const symbols = Object.keys(deployment.tokens.addr);
  const tokens = symbols.map(symbol => ({
    symbol,
    address: deployment.tokens.addr[symbol],
    decimals: deployment.tokens.conf[symbol].decimals,
    name: deployment.tokens.conf[symbol].name,
  }));

  return tokens;
}
