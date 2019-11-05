import { Resolver } from '~/graphql';
import { CanonicalPriceFeed } from '@melonproject/melonjs';

export const address: Resolver<CanonicalPriceFeed> = source => source.contract.address;
export const lastUpdate: Resolver<CanonicalPriceFeed> = async (source, _, context) => {
  try {
    const result = await source.getLastUpdate(context.block);
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
  }
};
