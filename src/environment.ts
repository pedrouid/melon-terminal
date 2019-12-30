import LRUCache from 'lru-cache';
import { DeployedEnvironment, DeploymentOutput } from '@melonproject/melonjs';
import { Eth } from 'web3-eth';
import { NetworkEnum } from './types';
import { HttpProvider, WebsocketProvider, HttpProviderOptions, WebsocketProviderOptions } from 'web3-providers';

export function createEnvironment(eth: Eth, deployment: DeploymentOutput, network: NetworkEnum) {
  // TODO: Fix network parameter.
  return new DeployedEnvironment(eth, network as any, deployment, {
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
