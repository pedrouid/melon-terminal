import { Resolver } from '~/graphql';
import { Version, Hub } from '@melonproject/melonjs';

export const address: Resolver<string> = address => address;

interface BalanceArgs {
  token: string;
}

export const balance: Resolver<string, BalanceArgs> = async (_, args, context) => {
  return context.loaders.balanceOf(args.token);
};

export const fund: Resolver<string> = async (manager, _, context) => {
  try {
    const version = new Version(context.environment, context.environment.deployment.melonContracts.version);
    const address = await version.getManagersToHubs(manager, context.block);
    const hub = new Hub(context.environment, address);
    // Duck typing the hub contract. If we can fetch a creator for the given
    // address, we assume that it's a valida hub address.
    const creator = await hub.getCreator(context.block);
    return creator && hub;
  } catch (e) {
    return null;
  }
};
