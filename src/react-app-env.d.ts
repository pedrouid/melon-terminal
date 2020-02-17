/// <reference types="react-scripts" />

import 'styled-components';
import { theme } from '~/theme';
import { Deployment, NetworkEnum } from './types';

declare module 'console' {
  export = typeof import('console');
}

declare module 'styled-components' {
  type DerivedTheme = typeof theme;

  export interface DefaultTheme extends DerivedTheme {}
}

declare global {
  declare namespace NodeJS {
    export interface ProcessEnv {
      MELON_MAINNET: string;
      MELON_MAINNET_SUBGRAPH: string;
      MELON_MAINNET_DEPLOYMENT?: string;
      MELON_KOVAN: string;
      MELON_KOVAN_SUBGRAPH: string;
      MELON_KOVAN_DEPLOYMENT?: string;
      MELON_TESTNET: string;
      MELON_TESTNET_SUBGRAPH: string;
      MELON_TESTNET_DEPLOYMENT?: string;
      MELON_TESTNET_PROVIDER: string;
      MELON_DEFAULT_PROVIDER: string;
      MELON_INCLUDE_GRAPHIQL: string;
      MELON_FORTMATIC_KEY: string;
      MELON_FORTMATIC_PROVIDER: string;
      MELON_FORTMATIC_NETWORK: string;
      MELON_API_GATEWAY: string;
    }
  }
}
