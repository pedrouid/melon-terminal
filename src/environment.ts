import LRUCache from 'lru-cache';
import { EnvironmentOptions } from '@melonproject/melonjs/Environment';
import { Environment as BaseEnvironment, Address, DeploymentOutput } from '@melonproject/melonjs';
import { Eth } from 'web3-eth';
import { NetworkEnum } from './types';
import { HttpProvider, WebsocketProvider, HttpProviderOptions, WebsocketProviderOptions } from 'web3-providers';

export function createEnvironment(eth: Eth, deployment: DeploymentOutput, network: NetworkEnum, account?: Address) {
  return new Environment(eth, network, deployment, account, {
    cache: new LRUCache(500),
  });
}

export const createProvider = (endpoint: string, options?: HttpProviderOptions | WebsocketProviderOptions) => {
  if (endpoint.startsWith('https://') || endpoint.startsWith('http://')) {
    return new HttpProvider(endpoint, options as HttpProviderOptions);
  }

  if (endpoint.startsWith('wss://') || endpoint.startsWith('ws://')) {
    return new WebsocketProvider(endpoint, options as WebsocketProviderOptions);
  }

  throw new Error('Invalid endpoint protocol.');
};

export class Environment extends BaseEnvironment {
  constructor(
    eth: Eth,
    public readonly network: NetworkEnum,
    public readonly deployment: DeploymentOutput,
    public readonly account?: Address,
    options?: EnvironmentOptions
  ) {
    super(eth, options);
  }
}
