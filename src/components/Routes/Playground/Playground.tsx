import 'graphiql/graphiql.css';

// @ts-ignore
import GraphiQL from 'graphiql';
import React, { useMemo, useContext } from 'react';
import ApolloClient from 'apollo-client';
import { GraphQLRequest, execute } from 'apollo-link';
import { parse } from 'graphql';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { Maybe } from '~/types';
import * as S from './Playground.styles';

export type RawRequest = GraphQLRequest & {
  query: string;
};

const createFetcher = (client: Maybe<ApolloClient<NormalizedCacheObject>>) => (request: RawRequest) => {
  if (!client) {
    return null;
  }

  return execute(client.link, {
    ...request,
    query: parse(request.query),
  });
};

const useFetcher = (client: Maybe<ApolloClient<NormalizedCacheObject>>) => {
  return useMemo(() => createFetcher(client), [client]);
};

const useStorage = (bucket: string) => {
  return useMemo(
    () => ({
      getItem: (name: string) => {
        return window.localStorage.getItem(`${bucket}:${name}`);
      },
      removeItem: (name: string) => {
        return window.localStorage.removeItem(`${bucket}:${name}`);
      },
      setItem: (name: string, value: any) => {
        return window.localStorage.setItem(`${bucket}:${name}`, value);
      },
    }),
    [bucket]
  );
};

export interface PlaygroundProps {
  context: React.Context<ApolloClient<NormalizedCacheObject>>;
  bucket: string;
}

export const Playground: React.FC<PlaygroundProps> = ({ context, bucket }) => {
  const ctx = useContext(context);
  const fetcher = ctx && useFetcher(ctx);
  const storage = useStorage(bucket);

  return fetcher ? (
    <S.Playground>
      <GraphiQL key={bucket} fetcher={fetcher} storage={storage} />
    </S.Playground>
  ) : null;
};

export default Playground;
