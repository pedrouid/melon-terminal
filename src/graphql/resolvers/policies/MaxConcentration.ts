import { Resolver } from '~/graphql';
import { MaxConcentration } from '@melonproject/melonjs';

export const maxConcentration: Resolver<MaxConcentration> = (policy, _, context) => {
  const maxConcentrationContract = new MaxConcentration(context.environment, policy.contract.address);
  return maxConcentrationContract.getMaxConcentration(context.block);
};
