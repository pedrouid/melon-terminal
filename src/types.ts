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

export interface Deployment {
  melon: {
    addr: MelonAddresses;
    conf: MelonConfig;
  };
  kyber: {
    addr: KyberAddresses;
    conf: KyberConfig;
  };
  ethfinex: {
    addr: EthfinexAddresses;
    conf: EthfinexConfig;
  };
  oasis: {
    addr: OasisDexAddresses;
    conf: OasisDexConfig;
  };
  zeroex: {
    addr: ZeroExAddresses;
    conf: ZeroExConfig;
  };
  tokens: {
    addr: TokenAddresses;
    conf: TokenConfig;
  };
}

interface MelonAddresses {
  EthfinexAdapter: string;
  KyberAdapter: string;
  MatchingMarketAdapter: string;
  MatchingMarketAccessor: string;
  ZeroExV2Adapter: string;
  EngineAdapter: string;
  PriceTolerance: string;
  UserWhitelist: string;
  ManagementFee: string;
  AccountingFactory: string;
  FeeManagerFactory: string;
  ParticipationFactory: string;
  PolicyManagerFactory: string;
  SharesFactory: string;
  TradingFactory: string;
  VaultFactory: string;
  PerformanceFee: string;
  Registry: string;
  Engine: string;
  Version: string;
  TestingPriceFeed?: string;
  KyberPriceFeed?: string;
}

interface MelonConfig {
  priceTolerance: number;
  userWhitelist: string[];
  registryOwner: string;
  engineDelay: number;
  maxSpread: number;
  versionOwner: string;
  initialMGM: string;
  versionName: string;
  exchangeTakesCustody: {
    oasis: boolean;
    kyber: boolean;
    zeroex: boolean;
    ethfinex: boolean;
    engine: boolean;
  };
}

interface KyberAddresses {
  KGT: string;
  ConversionRates: string;
  KyberReserve: string;
  KyberNetwork: string;
  KyberNetworkProxy: string;
  KyberWhiteList: string;
  ExpectedRate: string;
  FeeBurner: string;
}

interface KyberConfig {}

interface OasisDexAddresses {
  MatchingMarket: string;
}

interface OasisDexConfig {
  closeTime: number;
  quoteToken: string;
}

interface EthfinexAddresses {
  ZeroExV2Exchange: string;
  WrapperRegistryEFX: string;
  WrapperLockEth: string;
  'W-MLN': string;
  'W-BAT': string;
  'W-DAI': string;
  'W-DGX': string;
  'W-EUR': string;
  'W-KNC': string;
  'W-MKR': string;
  'W-REP': string;
  'W-ZRX': string;
}

interface EthfinexConfig {}

interface ZeroExAddresses {
  Exchange: string;
  ERC20Proxy: string;
}

interface ZeroExConfig {}

interface TokenAddresses {
  [key: string]: string;
}

interface TokenConfig {
  [key: string]: TokenConfigItem;
}

interface TokenConfigItem {
  name: string;
  decimals: number;
}
