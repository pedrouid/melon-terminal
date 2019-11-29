import { CanonicalPriceFeed } from '@melonproject/melonjs';
import { Resolver } from '~/graphql';
import { TokenDefinition } from '~/types';
import { fromWei } from 'web3-utils';
import BigNumber from 'bignumber.js';

export const price: Resolver<TokenDefinition> = async (token, _, context) => {
  const address = context.environment.deployment!.melonContracts.priceSource;
  const source = new CanonicalPriceFeed(context.environment, address);
  let price = { price: new BigNumber(0) };
  try {
    price = await source.getPrice(token.address, context.block);
  } catch (e) {}
  return fromWei(price.price.toFixed());
};
