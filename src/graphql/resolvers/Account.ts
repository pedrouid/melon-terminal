import { Resolver } from '~/graphql';
import { Version, Hub, Participation, Shares } from '@melonproject/melonjs';
import BigNumber from 'bignumber.js';

export const address: Resolver<string> = address => address;

interface BalanceArgs {
  token: string;
}

interface FundArgs {
  address: string;
}

interface AllowanceArgs {
  token: string;
  spender: string;
}

interface FundSpokeArgs {
  address: string;
}

export const balance: Resolver<string, BalanceArgs> = async (_, args, context) => {
  if (!args.token) {
    return new BigNumber(0);
  }
  return context.loaders.balanceOf(args.token);
};

export const allowance: Resolver<string, AllowanceArgs> = async (_, args, context) => {
  if (!args.spender || !args.token) {
    return new BigNumber(0);
  }
  return context.loaders.allowance(args.token, args.spender);
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

export const participation: Resolver<string, FundSpokeArgs> = async (account, args, context) => {
  const hub = new Hub(context.environment, args.address);
  const routes = await hub.getRoutes(context.block);

  if (!routes.participation) {
    return null;
  }

  const participationContract = new Participation(context.environment, routes.participation);

  return [participationContract, account];
};

export const shares: Resolver<string, FundSpokeArgs> = async (account, args, context) => {
  const hub = new Hub(context.environment, args.address);
  const routes = await hub.getRoutes(context.block);

  if (!routes.shares) {
    return null;
  }

  const sharesContract = new Shares(context.environment, routes.shares);

  return [sharesContract, account];
};
