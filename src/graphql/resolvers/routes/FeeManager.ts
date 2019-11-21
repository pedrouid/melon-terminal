import { Resolver } from '~/graphql';
import { FeeManager, PerformanceFee, ManagementFee } from '@melonproject/melonjs';

export const address: Resolver<FeeManager> = feeManager => feeManager.contract.address;

export const managementFeeAmount: Resolver<FeeManager> = async (feeManager, _, context) => {
  const amount = await feeManager.getManagementFeeAmount(context.block);
  return amount;
};

export const performanceFeeAmount: Resolver<FeeManager> = async (feeManager, _, context) => {
  const amount = await feeManager.getPerformanceFeeAmount(context.block);
  return amount;
};

export const performanceFee: Resolver<FeeManager> = async (feeManager, _, context) => {
  const address = await feeManager.getPerformanceFeeAddress(context.block);
  const performanceFee = new PerformanceFee(context.environment, address);
  return [feeManager, performanceFee];
};

export const managementFee: Resolver<FeeManager> = async (feeManager, _, context) => {
  const address = await feeManager.getManagementFeeAddress(context.block);
  const managementFee = new ManagementFee(context.environment, address);
  return [feeManager, managementFee];
};
