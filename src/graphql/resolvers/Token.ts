import BigNumber from 'bignumber.js';
import { Resolver } from '~/graphql';
import { fromWei } from 'web3-utils';
import { priceFeedContract } from '~/utils/deploymentContracts';
import { TokenDefinition } from '@melonproject/melonjs';

export const price: Resolver<TokenDefinition> = async (token, _, context) => {
  const source = priceFeedContract(context.environment);
  let price = { price: new BigNumber(0) };
  try {
    price = await source.getPrice(token.address, context.block);
  } catch (e) {}
  return fromWei(price.price.toFixed());
};
