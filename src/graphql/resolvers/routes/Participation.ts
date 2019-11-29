import { Resolver } from '~/graphql';
import { Participation } from '@melonproject/melonjs';

export const address: Resolver<Participation> = shares => shares.contract.address;

export const historicalInvestors: Resolver<Participation> = async (participation, _, context) => {
  return participation.getHistoricalInvestors(context.block);
};
