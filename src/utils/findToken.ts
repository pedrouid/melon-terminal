import { Deployment } from '~/types';
import { sameAddress } from '@melonproject/melonjs/utils/sameAddress';
import { availableTokens } from './availableTokens';

export function findToken(deployment: Deployment, which: string) {
  const tokens = availableTokens(deployment);
  const address = which.startsWith('0x');
  return tokens.find(token => {
    if (address && sameAddress(which, token.address)) {
      return true;
    }

    if (token.symbol === which) {
      return true;
    }

    return false;
  });
}
