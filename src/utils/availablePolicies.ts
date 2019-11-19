export interface AvailablePolicy {
  id: string;
  name: string;
  description?: string;
}

export const availablePolicies: AvailablePolicy[] = [
  {
    id: 'PriceTolerance:',
    name: 'Price tolerance (%)',
    description: 'The higher the tolerance, the greater the risk',
  },
  {
    id: 'MaxPositions',
    name: 'Maximum number of positions',
    description: 'Higher numbers, greater diversification potential',
  },
  {
    id: 'MaxConcentration',
    name: 'Max concentration (%)',
    description: 'High Diversification <-> High Concentration',
  },
  {
    id: 'UserWhitelist',
    name: 'User whitelist',
    description: 'Investor whitelist (one per line)',
  },
  {
    id: 'AssetWhitelist',
    name: 'Asset whitelist',
    description: 'Whitelisted, investable assets',
  },
  {
    id: 'AssetBlacklist',
    name: 'Asset blacklist',
    description: 'Blacklisted, investable assets',
  },
];
