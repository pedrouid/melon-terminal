import { toUtf8, hexToNumberString, isHexStrict } from 'web3-utils';

// TODO: This should never be needed. Instead, the subgraph should
// already return a string.
export function hexToString(hex: string): string {
  if (isHexStrict(hex)) {
    try {
      return toUtf8(hex);
    } catch (e) {
      return hexToNumberString(hex);
    }
  }

  return hex;
}
