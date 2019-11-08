import { useContext } from 'react';
import { useQuery, QueryHookOptions as BaseQueryHookOptions } from '@apollo/react-hooks';
import { OperationVariables, QueryResult } from '@apollo/react-common';
import { DocumentNode } from 'graphql';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { TheGraphApollo, OnChainApollo } from '~/components/Contexts/Apollo';

export type QueryHookOptions<TData = any, TVariables = OperationVariables> = BaseQueryHookOptions<TData, TVariables>;

export const useContextQuery = <TData = any, TVariables = OperationVariables>(
  context: ApolloClient<NormalizedCacheObject>,
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> => {
  return useQuery(query, {
    ...options,
    client: context,
  });
};

export const useOnChainClient = () => {
  return useContext(OnChainApollo);
};

export const useOnChainQuery = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> => {
  const client = useOnChainClient();
  return useContextQuery<TData, TVariables>(client, query, options);
};

export const useTheGraphClient = () => {
  return useContext(TheGraphApollo);
};

export const useTheGraphQuery = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> => {
  const client = useTheGraphClient();
  return useContextQuery<TData, TVariables>(client, query, options);
};
