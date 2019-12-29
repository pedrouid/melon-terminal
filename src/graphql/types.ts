import { Address } from '@melonproject/melonjs';
import BigNumber from 'bignumber.js';

export enum NetworkEnum {
  MAINNET = 'MAINNET',
  KOVAN = 'KOVAN',
  TESTNET = 'TESTNET',
  OFFLINE = 'OFFLINE',
  INVALID = 'INVALID',
}

export enum SetupProgressEnum {
  BEGIN = 'BEGIN',
  ACCOUNTING = 'ACCOUNTING',
  FEE_MANAGER = 'FEE_MANAGER',
  PARTICIPATION = 'PARTICIPATION',
  POLICY_MANAGER = 'POLICY_MANAGER',
  SHARES = 'SHARES',
  TRADING = 'TRADING',
  VAULT = 'VAULT',
  COMPLETE = 'COMPLETE',
}

export enum InvestmentRequestStateEnum {
  VALID = 'VALID',
  EXPIRED = 'EXPIRED',
  WAITING = 'WAITING',
  NONE = 'NONE',
}

export interface Block {
  hash?: string;
  number?: BigNumber;
  timestamp?: Date;
}

export interface Account {
  address?: Address;
  balance?: BigNumber;
  fund?: Hub;
  allowance?: BigNumber;
  participation?: AccountParticipation;
  shares?: AccountShares;
}

export interface AccountParticipation {
  address?: Address;
  hasInvested?: boolean;
  hasRequest?: boolean;
  hasValidRequest?: boolean;
  hasExpiredRequest?: boolean;
  investmentRequestState?: InvestmentRequestStateEnum;
  request?: InvestmentRequest;
  canCancelRequest?: boolean;
}

export interface AccountShares {
  address?: Address;
  balanceOf?: BigNumber;
}

export interface InvestmentRequest {
  investmentAsset?: Address;
  investmentAmount?: BigNumber;
  requestedShares?: BigNumber;
  timestamp?: Date;
}

export interface TokenBalance {
  token?: Token;
  balance?: BigNumber;
}

export interface Token {
  address?: Address;
  name?: string;
  symbol?: string;
  decimals?: number;
  price?: BigNumber;
}

export interface Holding {
  token?: Token;
  amount?: BigNumber;
  shareCostInAsset?: BigNumber;
}

export interface HubRoutes {
  version?: Version;
  accounting?: Accounting;
  participation?: Participation;
  shares?: Shares;
  trading?: Trading;
  vault?: Vault;
  feeManager?: FeeManager;
  policyManager?: PolicyManager;
}

export interface Hub {
  address?: Address;
  name?: string;
  routes?: HubRoutes;
  manager?: string;
  creator?: string;
  creationTime?: Date;
  isShutDown?: boolean;
  progress?: SetupProgressEnum;
}

export interface Accounting {
  address?: Address;
  holdings?: [Holding];
  grossAssetValue?: BigNumber;
  netAssetValue?: BigNumber;
  sharePrice?: BigNumber;
}

export interface Participation {
  address?: Address;
  historicalInvestors?: Address[];
}

export interface Shares {
  address?: Address;
  balanceOf?: BigNumber;
  totalSupply?: BigNumber;
}

export interface Trading {
  address?: Address;
  openMakeOrders?: OpenMakeOrder[];
  lockedAssets?: boolean;
}

export interface OpenMakeOrder {
  id?: BigNumber;
  expiresAt?: Date;
  orderIndex?: BigNumber;
  buyAsset?: Address;
  makerAsset?: Address;
  takerAsset?: Address;
  makerQuantity?: BigNumber;
  takerQuantity?: BigNumber;
  exchange?: Address;
}

export interface Vault {
  address?: Address;
}

export interface PolicyManager {
  address?: Address;
  policies?: Policy[];
}

export interface Policy {
  address?: Address;
  identifier?: string;
}

export interface MaxConcentration {
  address?: Address;
  identifier?: string;
  maxConcentration?: BigNumber;
}

export interface MaxPositions {
  address?: Address;
  identifier?: string;
  maxPositions?: number;
}

export interface PriceTolerance {
  address?: Address;
  identifier?: string;
  priceTolerance?: BigNumber;
}

export interface AssetWhitelist {
  address?: Address;
  identifier?: string;
  assetWhitelist?: Address[];
}

export interface AssetBlacklist {
  address?: Address;
  identifier?: string;
  assetBlacklist?: Address[];
}

export interface UserWhitelist {
  address?: Address;
  identifier?: string;
}

export interface CustomPolicy {
  address?: Address;
  identifier?: string;
}

export interface FeeManager {
  address?: Address;
  managementFeeAmount?: BigNumber;
  performanceFeeAmount?: BigNumber;
  performanceFee?: PerformanceFee;
  managementFee?: ManagementFee;
}

export interface PerformanceFee {
  address?: Address;
  rate?: number;
  period?: number;
  highWaterMark?: number;
  initializeTime?: Date;
  canUpdate?: boolean;
}

export interface ManagementFee {
  address?: Address;
  rate?: number;
}

export interface Version {
  address?: Address;
}

export interface PriceSource {
  address?: Address;
  lastUpdate?: Date;
}

export interface Schema {
  network?: NetworkEnum;
  block?: Block;
  prices?: PriceSource;
  account?: Account;
  accounts?: Account[];
  fund?: Hub;
}
