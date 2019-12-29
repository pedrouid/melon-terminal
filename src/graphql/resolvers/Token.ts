import { Resolver } from '~/graphql';
import { TokenDefinition } from '~/types';
import { fromWei } from 'web3-utils';
import BigNumber from 'bignumber.js';
import { priceFeedContract } from '~/utils/deploymentContracts';

export const price: Resolver<TokenDefinition> = async (token, _, context) => {
  const source = priceFeedContract(context.environment);
  let price = { price: new BigNumber(0) };
  try {
    price = await source.getPrice(token.address, context.block);
  } catch (e) {}
  return fromWei(price.price.toFixed());
};
