import { CanonicalPriceFeed } from '@melonproject/melonjs';
import { Resolver } from '~/graphql';
import { TokenDefinition } from '~/types';
import { fromWei } from 'web3-utils';

export const price: Resolver<TokenDefinition> = async (token, _, context) => {
  const address = context.environment.deployment!.melonContracts.priceSource;
  const source = new CanonicalPriceFeed(context.environment, address);
  const price = await source.getPrice(token.address, context.block);
  return fromWei(price.price.toFixed());
};
