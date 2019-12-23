import { encodeFunctionSignature } from '@melonproject/melonjs/utils/encodeFunctionSignature';
import { ExchangeAdapterAbi } from '@melonproject/melonjs/abis/ExchangeAdapter.abi';
import { ParticipationAbi } from '@melonproject/melonjs/abis/Participation.abi';

export interface AvailablePolicy {
  id: string;
  name: string;
  signatures: string[];
}

const tradingSignatures = [
  encodeFunctionSignature(ExchangeAdapterAbi, 'makeOrder'),
  encodeFunctionSignature(ExchangeAdapterAbi, 'takeOrder'),
];
const investmentSignatures = [encodeFunctionSignature(ParticipationAbi, 'requestInvestment')];

export const availablePolicies: AvailablePolicy[] = [
  {
    id: 'priceTolerance',
    name: 'Price Tolerance',
    signatures: [...tradingSignatures],
  },
  {
    id: 'maxPositions',
    name: 'Maximum number of positions',
    signatures: [...tradingSignatures, ...investmentSignatures],
  },
  {
    id: 'maxConcentration',
    name: 'Maximum Concentration',
    signatures: [...tradingSignatures, ...investmentSignatures],
  },
  {
    id: 'userWhitelist',
    name: 'User Whitelist',
    signatures: [...investmentSignatures],
  },
  {
    id: 'assetWhitelist',
    name: 'Asset Whitelist',
    signatures: [...tradingSignatures, ...investmentSignatures],
  },
  {
    id: 'assetBlacklist',
    name: 'Asset Blacklist',
    signatures: [...tradingSignatures, ...investmentSignatures],
  },
];
