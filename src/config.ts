import { NetworkEnum, Deployment } from './types';

export interface Config {
  subgraph: string;
  deployment: () => Promise<Deployment>;
}

export type ConfigMap = {
  [index in NetworkEnum]: Config;
};

async function loadDeployment(fallback: () => Promise<any>, source?: string) {
  if (source && (source.startsWith('https://') || source.startsWith('http://'))) {
    return (await fetch(source)).json();
  }

  if (source) {
    return JSON.parse(source);
  }

  return fallback();
}

export const config: ConfigMap = {
  ...(JSON.parse(process.env.MELON_MAINNET) && {
    [NetworkEnum.MAINNET]: {
      subgraph: process.env.MELON_MAINNET_SUBGRAPH,
      deployment: async () => {
        // @ts-ignore
        return loadDeployment(() => import('deployments/mainnet-deployment'), process.env.MELON_MAINNET_DEPLOYMENT);
      },
    },
  }),
  ...(JSON.parse(process.env.MELON_KOVAN) && {
    [NetworkEnum.KOVAN]: {
      subgraph: process.env.MELON_KOVAN_SUBGRAPH,
      deployment: async () => {
        // @ts-ignore
        return loadDeployment(() => import('deployments/kovan-deployment'), process.env.MELON_KOVAN_DEPLOYMENT);
      },
    },
  }),
  ...(JSON.parse(process.env.MELON_TESTNET) && {
    [NetworkEnum.TESTNET]: {
      subgraph: process.env.MELON_TESTNET_SUBGRAPH,
      deployment: async () => {
        // @ts-ignore
        return loadDeployment(() => import('deployments/testnet-deployment'), process.env.MELON_TESTNET_DEPLOYMENT);
      },
    },
  }),
};
