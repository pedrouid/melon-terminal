import { fromWei } from 'web3-utils';
import { Accounting } from '@melonproject/melonjs';
import { Resolver } from '~/graphql';
import { findToken } from '~/utils/findToken';
import { TokenDefinition } from '~/types';
import BigNumber from 'bignumber.js';

export const address: Resolver<Accounting> = accounting => accounting.contract.address;
export const sharePrice: Resolver<Accounting> = async (accounting, _, context) => {
  const calculations = await context.loaders.accountingCalculations(accounting);
  return fromWei(calculations.sharePrice.toFixed());
};

export const grossAssetValue: Resolver<Accounting> = async (accounting, _, context) => {
  const calculations = await context.loaders.accountingCalculations(accounting);
  return fromWei(calculations.gav.toFixed());
};

export const netAssetValue: Resolver<Accounting> = async (accounting, _, context) => {
  const calculations = await context.loaders.accountingCalculations(accounting);
  return fromWei(calculations.nav.toFixed());
};

export interface Holding {
  token: TokenDefinition;
  amount: BigNumber;
}

export const holdings: Resolver<Accounting> = async (accounting, _, context) => {
  const holdings = await accounting.getFundHoldings(context.block);
  return Object.keys(holdings).reduce<Holding[]>((carry, address) => {
    const token = findToken(context.environment.deployment!, address);
    if (!token) {
      return carry;
    }

    const item = {
      token,
      amount: new BigNumber(fromWei(holdings[address].toFixed())),
    };

    return [...carry, item];
  }, []);
};
