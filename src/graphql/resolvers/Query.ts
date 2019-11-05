import { Resolver } from '~/graphql';
import { Hub, CanonicalPriceFeed } from '@melonproject/melonjs';

export const block: Resolver = (_, __, context) => {
  return context.loaders.block(context.block);
};

export const network: Resolver = (_, __, context) => {
  return context.environment.network;
};

export const account: Resolver = async (_, __, context) => {
  return context.environment.account;
};

export const prices: Resolver = async (_, __, context) => {
  const address = context.environment.deployment!.melonContracts.priceSource;
  return new CanonicalPriceFeed(context.environment, address);
};

export const fund: Resolver = async (_, args, context) => {
  try {
    const hub = new Hub(context.environment, args.address);
    // Duck typing the hub contract. If we can fetch a creator for the given
    // address, we assume that it's a valida hub address.
    const creator = await hub.getCreator(context.block);
    return creator && hub;
  } catch (e) {
    return null;
  }
};
