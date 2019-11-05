import React, { useState, useMemo, useEffect, createContext, useRef } from 'react';
import * as Rx from 'rxjs';
import ApolloClient from 'apollo-client';
import { Eth } from 'web3-eth';
import { switchAll, pluck } from 'rxjs/operators';
import { ApolloLink, Observable, FetchResult } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createHttpLink } from 'apollo-link-http';
import { useObservable } from 'rxjs-hooks';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import { createSchemaLink, createSchema, createQueryContext } from '~/graphql';
import { Environment, createEnvironment, createProvider } from '~/Environment';
import { networkFromId } from '~/utils/networkFromId';
import { NetworkEnum } from '~/types';
import { getConfig } from '~/config';

// TODO: Fix this type.
export type ConnectionProvider = any;

export enum ConnectionProviderEnum {
  'DEFAULT' = 'DEFAULT',
  'FRAME' = 'FRAME',
  'METAMASK' = 'METAMASK',
  'CUSTOM' = 'CUSTOM',
}

export interface ApolloProviderContext {
  client: ApolloClient<NormalizedCacheObject>;
}

export interface OnChainContextValue extends ApolloProviderContext {
  set: (provider: ConnectionProviderEnum, observable: Rx.Observable<Environment>) => void;
  provider: ConnectionProviderEnum;
  environment?: Environment;
}

export interface TheGraphContextValue extends ApolloProviderContext {
  // Nothing to add here.
}

export const OnChainContext = createContext<OnChainContextValue>({} as OnChainContextValue);
export const TheGraphContext = createContext<TheGraphContextValue>({} as TheGraphContextValue);

const createErrorLink = () => {
  return onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
        const fields = path && path.join('.');
        console.error('[GQL ERROR]: Message: %s, Path: %s, Locations: %o', message, fields, locations);

        const stacktrace = extensions && extensions.exception && extensions.exception.stacktrace;
        if (stacktrace && stacktrace.length) {
          stacktrace.forEach((line: string) => {
            console.error(line);
          });
        }
      });
    }

    if (networkError) {
      console.error('[GQL NETWORK ERROR]: %o', networkError);
    }
  });
};

const createNullLink = () => {
  return new ApolloLink(() => new Observable<FetchResult>(() => {}));
};

const useOnChainApollo = (environment?: Environment) => {
  const schema = useMemo(() => {
    const connected =
      environment && (environment.network !== NetworkEnum.INVALID && environment.network !== NetworkEnum.OFFLINE);

    return connected && createSchema(environment!);
  }, [environment]);

  const apollo = useMemo(() => {
    const data = schema ? createSchemaLink({ schema, context: createQueryContext(environment!) }) : createNullLink();
    const error = createErrorLink();
    const link = ApolloLink.from([error, data]);
    const memory = new InMemoryCache({
      addTypename: true,
    });

    return new ApolloClient({
      link,
      cache: memory,
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all',
          fetchPolicy: 'no-cache',
        },
        query: {
          errorPolicy: 'all',
          fetchPolicy: 'no-cache',
        },
        mutate: {
          errorPolicy: 'all',
        },
      },
    });
  }, [environment, schema]);

  const apolloRef = useRef<ApolloClient<NormalizedCacheObject>>();
  useEffect(
    () => () => {
      apolloRef.current && apolloRef.current.stop();
      apolloRef.current && apolloRef.current.cache.reset();
      apolloRef.current = apollo;
    },
    [apollo]
  );

  return apollo;
};

const useTheGraphApollo = (environment?: Environment) => {
  const client = useMemo(() => {
    const config = environment && getConfig(environment.network);
    const subgraph = config && config.subgraph;
    const data = subgraph
      ? createHttpLink({ uri: `https://api.thegraph.com/subgraphs/name/${subgraph}` })
      : createNullLink();

    const error = createErrorLink();
    const link = ApolloLink.from([error, data]);
    const memory = new InMemoryCache({
      addTypename: true,
    });

    return new ApolloClient({
      link,
      cache: memory,
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all',
        },
        query: {
          errorPolicy: 'all',
        },
        mutate: {
          errorPolicy: 'all',
        },
      },
    });
  }, [environment]);

  return client;
};

export const ConnectionProvider: React.FC = props => {
  const [state, setState] = useState<{
    observable: Rx.Observable<Environment>;
    provider: ConnectionProviderEnum;
  }>({
    observable: Rx.defer(async () => {
      const eth = new Eth(createProvider('wss://mainnet.infura.io/ws/v3/8332aa03fcfa4c889aeee4d0e0628660'), undefined, {
        transactionConfirmationBlocks: 1,
      });

      return createEnvironment(eth, networkFromId(await eth.net.getId()));
    }),
    provider: ConnectionProviderEnum.DEFAULT,
  });

  const environment = useObservable<Environment | undefined, [Rx.Observable<Environment>]>(
    inputs$ => {
      return inputs$.pipe(
        pluck(0),
        switchAll()
      );
    },
    undefined,
    [state.observable]
  );

  const graph = useTheGraphApollo(environment);
  const chain = useOnChainApollo(environment);
  const set = (provider: ConnectionProviderEnum, observable: Rx.Observable<Environment>) => {
    setState({ provider, observable });
  };

  return (
    <OnChainContext.Provider value={{ set, environment, client: chain, provider: state.provider }}>
      <TheGraphContext.Provider value={{ client: graph }}>
        <ApolloProvider client={chain}>{props.children}</ApolloProvider>
      </TheGraphContext.Provider>
    </OnChainContext.Provider>
  );
};

export const RequireSecureConnection: React.FC = props => {
  // TODO: Render a modal window with the connection selector.
  return <>{props.children}</>;
};
