import React, { useState, useMemo, useEffect, createContext, useRef } from 'react';
import * as Rx from 'rxjs';
import ApolloClient from 'apollo-client';
import { switchAll, pluck } from 'rxjs/operators';
import { ApolloLink, Observable, FetchResult } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createHttpLink } from 'apollo-link-http';
import { useObservable } from 'rxjs-hooks';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import { createSchemaLink, createSchema, createQueryContext } from '~/graphql';
import { Environment } from '~/environment';
import { NetworkEnum } from '~/types';
import { getConfig } from '~/config';

// TODO: Fix this type.
export type ConnectionProvider = any;

export interface ApolloProviderContext {
  client: ApolloClient<NormalizedCacheObject>;
}

export interface OnChainContextValue extends ApolloProviderContext {
  select: (method: string, config?: any) => void;
  methods: ConnectionMethod[];
  method?: string;
  config?: any;
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
    const offline = [NetworkEnum.INVALID, NetworkEnum.OFFLINE];
    const connected = environment && !offline.includes(environment.network);
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
    const data = subgraph ? createHttpLink({ uri: subgraph }) : createNullLink();

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

export interface ConnectionMethod {
  name: string;
  component: React.ComponentType<any>;
  connect: (config?: any) => Rx.Observable<Environment>;
}

export interface ConnectionProviderProps {
  methods: ConnectionMethod[];
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = props => {
  const [current, set] = useState<{
    config?: any;
    name?: string;
  }>(() => {
    try {
      const stored = window.localStorage.getItem('connection-method');
      const method = stored ? JSON.parse(stored) : {};
      return method;
    } catch {
      // Nothing to do here.
      return {};
    }
  });

  const select = (name: string, config?: any) => {
    window.localStorage.setItem('connection-method', JSON.stringify({ name, config }));
    set({ name, config });
  };

  const observable = useMemo(() => {
    const method = props.methods.find(item => item.name === current.name);
    return method ? Rx.concat(Rx.of(undefined), method.connect(current.config)) : Rx.of(undefined);
  }, [props.methods, current]);

  const environment = useObservable<Environment | undefined, [Rx.Observable<Environment | undefined>]>(
    inputs$ => {
      return inputs$.pipe(
        pluck(0),
        switchAll()
      );
    },
    undefined,
    [observable]
  );

  const graph = useTheGraphApollo(environment);
  const chain = useOnChainApollo(environment);
  const methods = props.methods || [];

  return (
    <OnChainContext.Provider
      value={{ select, environment, methods, method: current.name, config: current.config, client: chain }}
    >
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
