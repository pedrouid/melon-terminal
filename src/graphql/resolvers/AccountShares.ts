import { Resolver } from '~/graphql';
import { Shares } from '@melonproject/melonjs';
import { fromWei } from 'web3-utils';

export const address: Resolver<[Shares, string]> = ([shares, _]) => shares.contract.address;

export const balanceOf: Resolver<[Shares, string]> = async ([shares, account], _, context) => {
  const balanceOf = await shares.getBalanceOf(account, context.block);
  return fromWei(balanceOf.toFixed());
};
