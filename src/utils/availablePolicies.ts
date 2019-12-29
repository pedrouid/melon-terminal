import { encodeFunctionSignature } from '@melonproject/melonjs/utils/encodeFunctionSignature';
import { ExchangeAdapterAbi } from '@melonproject/melonjs/abis/ExchangeAdapter.abi';
import { ParticipationAbi } from '@melonproject/melonjs/abis/Participation.abi';
import { PolicyDefinition } from '~/types';

export const tradingSignatures = [
  encodeFunctionSignature(ExchangeAdapterAbi, 'makeOrder'),
  encodeFunctionSignature(ExchangeAdapterAbi, 'takeOrder'),
];

export const investmentSignatures = [encodeFunctionSignature(ParticipationAbi, 'requestInvestment')];

export const priceTolerance: PolicyDefinition = {
  id: 'priceTolerance',
  name: 'Price Tolerance',
  signatures: [...tradingSignatures],
};

export const maxPositions: PolicyDefinition = {
  id: 'maxPositions',
  name: 'Maximum number of positions',
  signatures: [...tradingSignatures, ...investmentSignatures],
};

export const maxConcentration: PolicyDefinition = {
  id: 'maxConcentration',
  name: 'Maximum Concentration',
  signatures: [...tradingSignatures, ...investmentSignatures],
};

export const userWhitelist: PolicyDefinition = {
  id: 'userWhitelist',
  name: 'User Whitelist',
  signatures: [...investmentSignatures],
};

export const assetWhitelist: PolicyDefinition = {
  id: 'assetWhitelist',
  name: 'Asset Whitelist',
  signatures: [...tradingSignatures, ...investmentSignatures],
};

export const assetBlacklist: PolicyDefinition = {
  id: 'assetBlacklist',
  name: 'Asset Blacklist',
  signatures: [...tradingSignatures, ...investmentSignatures],
};

export const availablePolicies = [
  priceTolerance,
  maxPositions,
  maxConcentration,
  userWhitelist,
  assetWhitelist,
  assetBlacklist,
];
