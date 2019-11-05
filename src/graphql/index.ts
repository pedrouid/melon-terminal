import { forAwaitEach } from 'iterall';
import { execute, subscribe, GraphQLSchema, ExecutionArgs } from 'graphql';
import { ApolloLink, FetchResult, Observable, Operation } from 'apollo-link';
import { makeExecutableSchema } from 'graphql-tools';
import { isSubscription } from '~/graphql/utils/isSubscription';
import { ensureIterable } from '~/graphql/utils/ensureIterable';
import { Environment } from '~/environment';
import { createTokenEnum, createTokenEnumDefinition } from '~/graphql/enums/TokenEnum';
import * as loaders from '~/graphql/loaders';
import * as resolvers from '~/graphql/resolvers';
// @ts-ignore
import SchemaDefinition from '~/graphql/schema.graphql';

export type Resolver<TParent = any, TArgs = any> = (parent: TParent, args: TArgs, context: Context) => any;
export type ContextCreator = (request: Operation) => Promise<Context> | Context;
export type Loaders = {
  [K in keyof typeof loaders]: ReturnType<typeof loaders[K]>;
};

export interface Context {
  environment: Environment;
  loaders: Loaders;
  block: number;
}

interface SchemaLinkOptions<TRoot = any, TContext = any> {
  schema: GraphQLSchema;
  context: TContext;
  root?: TRoot;
}

export const createQueryContext = (environment: Environment): ContextCreator => {
  return async () => {
    const block = await environment.client.getBlockNumber();
    const context: Context = {
      block,
      environment,
      loaders: {} as Loaders,
    };

    Object.keys(loaders).forEach(key => {
      // @ts-ignore
      context.loaders[key] = loaders[key](context);
    });

    return context;
  };
};

export const createSchema = (environment: Environment) => {
  const TokenEnum = createTokenEnum(environment);
  const executable = makeExecutableSchema({
    resolvers: { ...resolvers, TokenEnum },
    typeDefs: [createTokenEnumDefinition(TokenEnum), SchemaDefinition],
    inheritResolversFromInterfaces: true,
  });

  return executable;
};

export const createSchemaLink = <TRoot = any>(options: SchemaLinkOptions<TRoot, ContextCreator>) => {
  const handleRequest = async (request: Operation, observer: any) => {
    try {
      const context: Context = await options.context(request);
      const args: ExecutionArgs = {
        schema: options.schema,
        rootValue: options.root,
        contextValue: context,
        variableValues: request.variables,
        operationName: request.operationName,
        document: request.query,
      };

      const result = isSubscription(request.query) ? subscribe(args) : execute(args);
      const iterable = ensureIterable(await result) as AsyncIterable<any>;
      await forAwaitEach(iterable, (value: any) => observer.next(value));
      observer.complete();
    } catch (error) {
      observer.error(error);
    }
  };

  const createObservable = (request: Operation) => {
    return new Observable<FetchResult>(observer => {
      handleRequest(request, observer);
    });
  };

  return new ApolloLink(request => createObservable(request));
};
