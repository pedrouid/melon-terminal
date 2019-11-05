import { NetworkEnum, Deployment } from './types';

export interface Config {
  default: string;
  subgraph: string;
  deployment: () => Promise<Deployment>;
}

export type ConfigMap = {
  [index in NetworkEnum]?: Config;
};

export function getConfig(network: NetworkEnum) {
  return config[network];
}

const config: ConfigMap = {
  [NetworkEnum.MAINNET]: {
    default: 'wss://mainnet.infura.io/ws/v3/8332aa03fcfa4c889aeee4d0e0628660',
    subgraph: 'https://api.thegraph.com/subgraphs/name/melonproject/melon',
    deployment: () => import('~/deployments/mainnet').then(value => value.default),
  },
  [NetworkEnum.KOVAN]: {
    default: 'wss://kovan.infura.io/ws/v3/8332aa03fcfa4c889aeee4d0e0628660',
    subgraph: 'https://api.thegraph.com/subgraphs/name/melonproject/melon-kovan',
    deployment: () => import('~/deployments/kovan').then(value => value.default),
  },
  [NetworkEnum.TESTNET]: {
    default: 'http://localhost:8545',
    // TODO: Add a development environment with a local subgraph.
    subgraph: '',
    deployment: () => import('~/deployments/testnet').then(value => value.default),
  },
};
