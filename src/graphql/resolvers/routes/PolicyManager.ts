import { Resolver } from '~/graphql';
import { PolicyManager, Policy } from '@melonproject/melonjs';

export const address: Resolver<PolicyManager> = policyManager => policyManager.contract.address;

export const policies: Resolver<PolicyManager> = async (policyManager, _, context) => {
  const policies = await policyManager.getPolicies(context.block);

  return policies.map(policy => new Policy(context.environment, policy.address));
};
