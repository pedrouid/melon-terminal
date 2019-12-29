export type Maybe<T> = T | null | undefined;

export enum NetworkEnum {
  'TESTNET' = 'TESTNET',
  'MAINNET' = 'MAINNET',
  'KOVAN' = 'KOVAN',
}

export interface PolicyDefinition {
  id: string;
  name: string;
  signatures: string[];
}

export interface TokenDefinition {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
}

export interface ExchangeDefinition {
  name: string;
  exchange: string;
  adapter: string;
}
