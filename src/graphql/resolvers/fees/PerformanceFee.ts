import { fromWei } from 'web3-utils';
import { PerformanceFee, FeeManager } from '@melonproject/melonjs';
import { Resolver } from '~/graphql';

export const address: Resolver<[FeeManager, PerformanceFee]> = ([_, performanceFee]) => performanceFee.contract.address;

export const rate: Resolver<[FeeManager, PerformanceFee]> = async ([feeManager, performanceFee], _, context) => {
  const rate = await performanceFee.getPerformanceFeeRate(feeManager.contract.address, context.block);
  return fromWei(rate.multipliedBy(100).toFixed());
};

export const period: Resolver<[FeeManager, PerformanceFee]> = async ([feeManager, performanceFee], _, context) => {
  const period = await performanceFee.getPerformanceFeePeriod(feeManager.contract.address, context.block);
  return period ? period / (60 * 60 * 24) : 0;
};

export const highWaterMark: Resolver<[FeeManager, PerformanceFee]> = async (
  [feeManager, performanceFee],
  _,
  context
) => {
  const result = await performanceFee.getHighWaterMark(feeManager.contract.address, context.block);
  return fromWei(result.toFixed());
};

export const initializeTime: Resolver<[FeeManager, PerformanceFee]> = ([feeManager, performanceFee], _, context) => {
  return performanceFee.getInitializeTime(feeManager.contract.address, context.block);
};

export const canUpdate: Resolver<[FeeManager, PerformanceFee]> = ([feeManager, performanceFee], _, context) => {
  return performanceFee.canUpdate(feeManager.contract.address, context.block);
};
