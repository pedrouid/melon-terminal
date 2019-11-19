import { Resolver } from '~/graphql';
import { AssetWhitelist } from '@melonproject/melonjs';

export const assetWhitelist: Resolver<AssetWhitelist> = (policy, _, context) => {
  const assetWhitelistContract = new AssetWhitelist(context.environment, policy.contract.address);
  return assetWhitelistContract.getMembers(context.block);
};
