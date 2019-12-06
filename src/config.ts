import { NetworkEnum, Deployment } from './types';

export interface Config {
  subgraph: string;
  deployment: () => Promise<Deployment>;
}

export type ConfigMap = {
  [index in NetworkEnum]: Config;
};

export const config: ConfigMap = {
  ...(JSON.parse(process.env.MELON_MAINNET) && {
    [NetworkEnum.MAINNET]: {
      subgraph: process.env.MELON_MAINNET_SUBGRAPH,
      // @ts-ignore
      deployment: async () => (await import('deployments/mainnet-deployment')) as Deployment,
    },
  }),
  ...(JSON.parse(process.env.MELON_KOVAN) && {
    [NetworkEnum.KOVAN]: {
      subgraph: process.env.MELON_KOVAN_SUBGRAPH,
      // @ts-ignore
      deployment: async () => (await import('deployments/kovan-deployment')) as Deployment,
    },
  }),
  ...(JSON.parse(process.env.MELON_TESTNET) && {
    [NetworkEnum.TESTNET]: {
      subgraph: process.env.MELON_TESTNET_SUBGRAPH,
      // @ts-ignore
      deployment: async () => (await import('deployments/testnet-deployment')) as Deployment,
    },
  }),
};
