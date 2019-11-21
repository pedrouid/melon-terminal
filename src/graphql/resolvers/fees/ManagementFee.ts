import { fromWei } from 'web3-utils';
import { FeeManager, ManagementFee } from '@melonproject/melonjs';
import { Resolver } from '~/graphql';

export const address: Resolver<[FeeManager, ManagementFee]> = ([_, managementFee]) => managementFee.contract.address;

export const rate: Resolver<[FeeManager, ManagementFee]> = async ([feeManager, managementFee], _, context) => {
  const rate = await managementFee.getManagementFeeRate(feeManager.contract.address, context.block);
  return fromWei(rate.multipliedBy(100).toFixed());
};
