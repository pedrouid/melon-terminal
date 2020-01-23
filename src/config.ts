import { NetworkEnum } from './types';
import { DeploymentOutput, TokenDefinition, ExchangeDefinition, PolicyDefinition } from '@melonproject/melonjs';

export interface Config {
  subgraph: string;
  deployment: () => Promise<DeploymentOutput>;
  tokens?: TokenDefinition[];
  exchanges?: ExchangeDefinition[];
  policies?: PolicyDefinition[];
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
      tokens: [
        {
          symbol: 'DGX',
          address: '0x4f3afec4e5a3f2a6a1a411def7d7dfe50ee057bf',
          decimals: 9,
          name: 'Digix Gold Token',
          historic: true,
        },
      ],
      exchanges: [
        {
          name: 'ZeroEx (v. 2.0)',
          id: 'ZeroExV2Old',
          adapter: '0x3ECFe6F8414ED517366a5e6f7F7FC74EF21CAac9',
          exchange: '0x4F833a24e1f95D70F028921e27040Ca56E09AB0b',
          historic: true,
        },
      ],
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
