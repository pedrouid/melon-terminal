import { Deployment } from '~/types';
import { sameAddress } from '@melonproject/melonjs/utils/sameAddress';

export function findToken(deployment: Deployment, which: string) {
  const tokens = deployment.thirdPartyContracts.tokens;
  const address = which.startsWith('0x');
  const token = tokens.find(token => {
    if (token.symbol === which) {
      return true;
    }

    if (address && sameAddress(which, token.address)) {
      return true;
    }

    return false;
  });

  return token;
}
