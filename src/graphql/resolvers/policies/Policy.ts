import { Policy } from '@melonproject/melonjs';
import { Resolver } from '~/graphql';

export const address: Resolver<Policy> = policy => policy.contract.address;

export const identifier: Resolver<Policy> = policy => policy.getIdentifier();

export const __resolveType: Resolver<Policy> = async (policy, _, context) => {
  const identifier = await policy.getIdentifier(context.block);
  switch (identifier) {
    case 'Max concentration':
      return 'MaxConcentration';
    case 'Max positions':
      return 'MaxPositions';
    case 'Price tolerance':
      return 'PriceTolerance';
    case 'Asset whitelist':
      return 'AssetWhitelist';
    case 'Asset blacklist':
      return 'AssetBlacklist';
    case 'UserWhitelist':
      return 'UserWhitelist';
    default:
      return 'CustomPolicy';
  }
};
