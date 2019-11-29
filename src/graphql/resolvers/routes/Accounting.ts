import { fromWei } from 'web3-utils';
import { Accounting } from '@melonproject/melonjs';
import { Resolver } from '~/graphql';
import { findToken } from '~/utils/findToken';
import { TokenDefinition } from '~/types';
import BigNumber from 'bignumber.js';
import { share } from 'rxjs/operators';

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

  return Promise.all(
    holdings.map(async holding => {
      const token = findToken(context.environment.deployment!, holding.address);

      let shareCostInAsset = new BigNumber(0);
      if (token && token.symbol) {
        try {
          shareCostInAsset = await accounting.getShareCostInAsset(
            new BigNumber('1e18'),
            holding.address,
            context.block
          );
        } catch (e) {}
      }
      return { amount: holding.amount, token: token || null, shareCostInAsset };
    })
  );
};
