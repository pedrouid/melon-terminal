import { Resolver } from '~/graphql';
import { AssetBlacklist } from '@melonproject/melonjs';

export const assetBlacklist: Resolver<AssetBlacklist> = (policy, _, context) => {
  const assetBlacklistContract = new AssetBlacklist(context.environment, policy.contract.address);
  return assetBlacklistContract.getMembers(context.block);
};
