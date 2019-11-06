import { Resolver } from '~/graphql';
import { CanonicalPriceFeed } from '@melonproject/melonjs';

export const address: Resolver<CanonicalPriceFeed> = source => source.contract.address;
export const lastUpdate: Resolver<CanonicalPriceFeed> = (source, _, context) => {
  return source.getLastUpdate(context.block);
};
