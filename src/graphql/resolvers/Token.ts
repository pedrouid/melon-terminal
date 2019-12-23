import { CanonicalPriceFeed } from '@melonproject/melonjs';
import { fromWei } from 'web3-utils';
import BigNumber from 'bignumber.js';
import { Resolver } from '~/graphql';
import { TokenDefinition } from '~/types';

export const price: Resolver<TokenDefinition> = async (token, _, context) => {
  // TODO: Load the right price feed based on the deployment definitions.
  const address = context.environment.deployment!.melon.addr.TestingPriceFeed;
  const source = new CanonicalPriceFeed(context.environment, address);
  let price = { price: new BigNumber(0) };
  try {
    price = await source.getPrice(token.address, context.block);
  } catch (e) {}
  return fromWei(price.price.toFixed());
};
