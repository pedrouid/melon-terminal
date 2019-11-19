import { Resolver } from '~/graphql';
import {
  Accounting,
  Version,
  Participation,
  Shares,
  Vault,
  FeeManager,
  PolicyManager,
  Trading,
  HubRoutes,
  Hub,
} from '@melonproject/melonjs';

export const accounting: Resolver<[Hub, HubRoutes]> = ([_, routes], __, context) => {
  return routes.accounting && new Accounting(context.environment, routes.accounting);
};

export const version: Resolver<[Hub, HubRoutes]> = ([_, routes], __, context) => {
  return routes.version && new Version(context.environment, routes.version);
};

export const participation: Resolver<[Hub, HubRoutes]> = ([_, routes], __, context) => {
  return routes.participation && new Participation(context.environment, routes.participation);
};

export const shares: Resolver<[Hub, HubRoutes]> = ([_, routes], __, context) => {
  return routes.shares && new Shares(context.environment, routes.shares);
};

export const trading: Resolver<[Hub, HubRoutes]> = ([_, routes], __, context) => {
  return routes.trading && new Trading(context.environment, routes.trading);
};

export const vault: Resolver<[Hub, HubRoutes]> = ([_, routes], __, context) => {
  return routes.vault && new Vault(context.environment, routes.vault);
};

export const feeManager: Resolver<[Hub, HubRoutes]> = ([_, routes], __, context) => {
  return routes.feeManager && new FeeManager(context.environment, routes.feeManager);
};

export const policyManager: Resolver<[Hub, HubRoutes]> = ([_, routes], __, context) => {
  return routes.policyManager && new PolicyManager(context.environment, routes.policyManager);
};
