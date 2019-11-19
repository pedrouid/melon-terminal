import { Resolver } from '~/graphql';
import { Hub, Version } from '@melonproject/melonjs';

enum SetupProgress {
  BEGIN = 'BEGIN',
  ACCOUNTING = 'ACCOUNTING',
  FEE_MANAGER = 'FEE_MANAGER',
  PARTICIPATION = 'PARTICIPATION',
  POLICY_MANAGER = 'POLICY_MANAGER',
  SHARES = 'SHARES',
  TRADING = 'TRADING',
  VAULT = 'VAULT',
  COMPLETE = 'COMPLETE',
}

export const address: Resolver<Hub> = hub => hub.contract.address;
export const name: Resolver<Hub> = (hub, _, context) => hub.getName(context.block);
export const manager: Resolver<Hub> = (hub, _, context) => hub.getManager(context.block);
export const creator: Resolver<Hub> = (hub, _, context) => hub.getCreator(context.block);
export const creationTime: Resolver<Hub> = (hub, _, context) => hub.getCreationTime(context.block);
export const isShutDown: Resolver<Hub> = (hub, _, context) => hub.isShutDown(context.block);
export const routes: Resolver<Hub> = async (hub, _, context) => [hub, await hub.getRoutes(context.block)];
export const progress: Resolver<Hub> = async (hub, _, context) => {
  const version = new Version(context.environment, context.environment.deployment.melonContracts.version);
  if (await version.isInstance(hub.contract.address, context.block)) {
    return SetupProgress.COMPLETE;
  }

  const routes = await version.getManagersToRoutes(await hub.getManager(context.block), context.block);
  if (routes.vault) {
    return SetupProgress.VAULT;
  }

  if (routes.trading) {
    return SetupProgress.TRADING;
  }

  if (routes.shares) {
    return SetupProgress.SHARES;
  }

  if (routes.policyManager) {
    return SetupProgress.POLICY_MANAGER;
  }

  if (routes.participation) {
    return SetupProgress.PARTICIPATION;
  }

  if (routes.feeManager) {
    return SetupProgress.FEE_MANAGER;
  }

  if (routes.accounting) {
    return SetupProgress.ACCOUNTING;
  }

  return SetupProgress.BEGIN;
};
