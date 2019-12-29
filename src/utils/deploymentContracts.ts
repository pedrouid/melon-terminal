import { KyberPriceFeed, Version } from '@melonproject/melonjs';
import { Environment } from '~/environment';

export function priceFeedContract(environment: Environment) {
  const addresses = environment.deployment.melon.addr;
  if (addresses.TestingPriceFeed) {
    return new KyberPriceFeed(environment, addresses.TestingPriceFeed);
  }

  if (addresses.KyberPriceFeed) {
    return new KyberPriceFeed(environment, addresses.KyberPriceFeed);
  }

  throw new Error('Missing price feed address');
}

export function versionContract(environment: Environment) {
  return new Version(environment, environment.deployment.melon.addr.Version);
}
