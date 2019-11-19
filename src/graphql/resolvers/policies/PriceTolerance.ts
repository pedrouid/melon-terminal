import { Resolver } from '~/graphql';
import { PriceTolerance } from '@melonproject/melonjs';

export const priceTolerance: Resolver<PriceTolerance> = (policy, _, context) => {
  const priceToleranceContract = new PriceTolerance(context.environment, policy.contract.address);
  return priceToleranceContract.getPriceTolerance(context.block);
};
