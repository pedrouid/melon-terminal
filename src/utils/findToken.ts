import { Deployment, TokenDefinition } from '~/types';
import { sameAddress } from '@melonproject/melonjs/utils/sameAddress';

export function findToken(deployment: Deployment, which: string): TokenDefinition | undefined {
  const addresses = deployment.tokens.addr;
  const symbols = Object.keys(addresses);
  const indexes = (Object.keys(symbols) as any) as number[];

  const prefixed = which.startsWith('0x');
  const index = indexes.find(index => {
    const symbol = (symbols as any)[index];
    if (symbol === which) {
      return true;
    }

    const address = addresses[symbol];
    if (prefixed && sameAddress(which, address)) {
      return true;
    }

    return false;
  });

  if (index == null) {
    return undefined;
  }

  const symbol = symbols[index];
  const address = addresses[symbol];
  const config = deployment.tokens.conf[symbol];

  return {
    symbol,
    address,
    name: config.name,
    decimals: config.decimals,
  };
}
