import { NetworkEnum, Deployment } from './types';

export interface Config {
  default: string;
  subgraph: string;
  deployment: () => Promise<Deployment>;
}

export type ConfigMap = {
  [index in NetworkEnum]: Config;
};

export const config: ConfigMap = {
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
    default: 'http://127.0.0.1:8545',
    subgraph: 'http://127.0.0.1:8000/subgraphs/name/melonproject/melon',
    deployment: () => import('~/deployments/testnet').then(value => value.default),
  },
};
