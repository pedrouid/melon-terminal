import { Resolver } from '~/graphql';
import { MaxPositions } from '@melonproject/melonjs';

export const maxPositions: Resolver<MaxPositions> = (policy, _, context) => {
  const maxPositionsContract = new MaxPositions(context.environment, policy.contract.address);
  return maxPositionsContract.getMaxPositions(context.block);
};
