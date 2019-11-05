import { Deployment } from '~/types';

const deployment: Deployment = {
  meta: {
    deployer: '0xC0c82081f2Ad248391cd1483ae211d56c280887a',
    timestamp: '2019-11-05T10:18:49.170Z',
    track: 'kyberPrice',
    version: '1.0.9',
    chain: 4,
  },
  melonContracts: {
    priceSource: '0x432240EE3d41F9a97F401A06e7Ed6AC6fCC936E2',
    adapters: {
      ethfinexAdapter: '0x381d2197EF5856ddBb2Dfc228a43194915E86896',
      kyberAdapter: '0xf0F019EBc03136C1c1f4b32606b9d3da17A97724',
      matchingMarketAdapter: '0xAa830cDD95049Bf78Ba44aA042f2D76Df4d214Ab',
      matchingMarketAccessor: '0xC337Fd1F0EBF5eAAD7f613Cea95Cf46C9313300A',
      zeroExAdapter: '0xCe32da0C3Af27C6ed19B30E77A1A0348023D7ae8',
      engineAdapter: '0x2AF77DC9B9026CF40167b1a37e7E1763Acd4af05',
    },
    policies: {
      priceTolerance: '0x0cB100f46774B0430F4C401fb478217112001CDe',
      userWhitelist: '0x35220EFA8028aB40af0f14c291173540E758dc24',
    },
    fees: {
      managementFee: '0x2bB7178dA9A3471a876858567517CEB786F290eD',
      performanceFee: '0xB4445EBA01Ab0b099087D44FA1E29305673d213f',
    },
    factories: {
      accountingFactory: '0xCf108D4C19bED77bCd91793B389c8e690CF5D07A',
      feeManagerFactory: '0x9522300d5467028c75dA2F23Ebec88841A3935f7',
      participationFactory: '0x7a5c78FEcD03266872035788d7a599d1A9277530',
      policyManagerFactory: '0x28c0a72A25346B5c8e1b70C8f837DA2A61ba071c',
      sharesFactory: '0xFd61e004f9c4005B4DE72e16349A4132f14A4b8b',
      tradingFactory: '0x8005f9FDfAA19B7490654ac93274C25C47A425A2',
      vaultFactory: '0x14DE4889C11eC5F67986c7367917A560C9Ec7d3a',
    },
    engine: '0xFeeAb9d6D46B34B4D614473D48A677d8B2714D2A',
    registry: '0x74F62E3a349F66F9823c2728629093B37E8De062',
    version: '0x9E148dfA1bCD089f80F2efC552712ed97D3C4fA4',
    ranking: '0x78435945846F63A030276A20f1F90b554a8824cD',
  },
  thirdPartyContracts: {
    exchanges: {
      ethfinex: {
        erc20proxy: '0x2A5413eBe62c01BfcaC9acd3e1931f84Fd74c69C',
        exchange: '0x518f69Aa7b38530342a12315b6D459265367D50c',
        wrapperPairs: [
          {
            token: '0xB1264a807FE06E581eb2832639aa2593dbA8D44B',
            wrapper: '0x16c5452F63a78ED6aFae499e9aAe1763C7626DcA',
          },
          {
            token: '0x699f827d3B5E5DF6F7D304935b89F6f9aF7d5462',
            wrapper: '0xf4F5300f41e89d2408C8b838e6d1efF56fd108AD',
          },
          {
            token: '0xa344e9647f494E18c2Bd22f5e645BA13B2636dD2',
            wrapper: '0x464da2922783DA850F1FdA7d9cd271604B3E98D6',
          },
          {
            token: '0x82abC6b4bA0E20aE02FD43f13a2F5fb1e96DA70F',
            wrapper: '0xc3F975e84f65419ff850805349fC77cf47B479c1',
          },
          {
            token: '0xc19c22469905A7d10642e22A931B7F25Cc848eC7',
            wrapper: '0xF7416b49749Eb9edEf5b7f1a2ddeAb2598550058',
          },
          {
            token: '0x3cb163115a1cc760e15aa3f7162c08FCd3D9144D',
            wrapper: '0xd086AD19e0aeaAb5183FE1d829ad0f5fE38b2C16',
          },
        ],
        wrapperRegistryEFX: '0xA9ec37860667bC5B5e8c6124455002DB8f9264A8',
      },
      kyber: {
        conversionRates: '0x5D5e69Ef0d1B4018B61F01CF576915D18ABDB257',
        kyberNetwork: '0x1c38f34978fC8cC2EA95b6458ac5f25Db2B720F8',
        kyberNetworkProxy: '0x7eb74deb80254010F460b179c181F94e70d4D9e3',
      },
      matchingMarket: '0x5835Cd48e7cC2825DfA5349F0cbC8B878207c921',
      zeroEx: '0x518f69Aa7b38530342a12315b6D459265367D50c',
    },
    tokens: [
      {
        address: '0xB1264a807FE06E581eb2832639aa2593dbA8D44B',
        decimals: 18,
        symbol: 'WETH',
        reserveMin: 1000000000000000000,
      },
      {
        address: '0x699f827d3B5E5DF6F7D304935b89F6f9aF7d5462',
        decimals: 18,
        symbol: 'MLN',
        reserveMin: 1000000000000000000,
      },
      {
        address: '0xa344e9647f494E18c2Bd22f5e645BA13B2636dD2',
        decimals: 18,
        symbol: 'ZRX',
        reserveMin: 1000000000000000000,
      },
      {
        address: '0x82abC6b4bA0E20aE02FD43f13a2F5fb1e96DA70F',
        decimals: 18,
        symbol: 'EUR',
        reserveMin: 1000000000000000000,
      },
      {
        address: '0xc19c22469905A7d10642e22A931B7F25Cc848eC7',
        decimals: 18,
        symbol: 'DGX',
        reserveMin: 1000000000000000000,
      },
      {
        address: '0x3cb163115a1cc760e15aa3f7162c08FCd3D9144D',
        decimals: 18,
        symbol: 'DAI',
        reserveMin: 1000000000000000000,
      },
    ],
  },
  exchangeConfigs: {
    MatchingMarket: {
      adapter: '0xAa830cDD95049Bf78Ba44aA042f2D76Df4d214Ab',
      exchange: '0x5835Cd48e7cC2825DfA5349F0cbC8B878207c921',
      takesCustody: true,
    },
    KyberNetwork: {
      adapter: '0xf0F019EBc03136C1c1f4b32606b9d3da17A97724',
      exchange: '0x7eb74deb80254010F460b179c181F94e70d4D9e3',
      takesCustody: false,
    },
    ZeroEx: {
      adapter: '0xCe32da0C3Af27C6ed19B30E77A1A0348023D7ae8',
      exchange: '0x518f69Aa7b38530342a12315b6D459265367D50c',
      takesCustody: false,
    },
    Ethfinex: {
      adapter: '0x381d2197EF5856ddBb2Dfc228a43194915E86896',
      exchange: '0x518f69Aa7b38530342a12315b6D459265367D50c',
      takesCustody: true,
    },
    MelonEngine: {
      adapter: '0x2AF77DC9B9026CF40167b1a37e7E1763Acd4af05',
      exchange: '0xFeeAb9d6D46B34B4D614473D48A677d8B2714D2A',
      takesCustody: false,
    },
  },
};

export default deployment;
