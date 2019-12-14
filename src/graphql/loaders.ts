import * as R from 'ramda';
import BigNumber from 'bignumber.js';
import { fromWei } from 'web3-utils';
import { Address, Accounting, ERC20WithFields } from '@melonproject/melonjs';
import { Context } from '.';

export const block = (context: Context) => (number: number) => {
  const eth = context.environment.client;
  return eth.getBlock(number);
};

export const balanceOf = (context: Context) => {
  return async (token: Address | string) => {
    const account = context.environment.account;
    if (!account) {
      return new BigNumber(0);
    }

    if (token === 'ETH') {
      const balance = await context.environment.client.getBalance(account, context.block);
      return new BigNumber(fromWei(balance));
    }

    const instance = new ERC20WithFields(context.environment, token);
    const [decimals, balance] = await Promise.all([
      instance.getDecimals(context.block),
      instance.getBalanceOf(account, context.block),
    ]);

    return new BigNumber(balance.dividedBy(new BigNumber(10).exponentiatedBy(decimals)).toFixed());
  };
};

export const allowance = (context: Context) => {
  return async (token: Address | string, spender: Address) => {
    const account = context.environment.account;
    if (!account) {
      return new BigNumber(0);
    }

    const instance = new ERC20WithFields(context.environment, token);
    const [decimals, allowance] = await Promise.all([
      instance.getDecimals(context.block),
      instance.getAllowance(account, spender, context.block),
    ]);

    return new BigNumber(allowance.dividedBy(new BigNumber(10).exponentiatedBy(decimals)).toFixed());
  };
};

export const accountingCalculations = (context: Context) => {
  return R.memoizeWith(
    (accounting: Accounting) => accounting.contract.address,
    (accounting: Accounting) => {
      return accounting.getCalculationResults(context.block);
    }
  );
};
