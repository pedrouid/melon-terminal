import * as Rx from 'rxjs';
import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import { createEnvironment } from '~/environment';
import { config } from '~/config';
import { Address, DeploymentOutput, DeployedEnvironment } from '@melonproject/melonjs';
import { NetworkEnum } from '~/types';
import { Eth } from 'web3-eth';

export enum ConnectionStatus {
  OFFLINE,
  CONNECTING,
  CONNECTED,
}

export interface ConnectionState {
  deployment?: DeploymentOutput;
  eth?: Eth;
  network?: NetworkEnum;
  accounts?: Address[];
  method?: string;
  error?: Error;
}

export enum ConnectionActionType {
  METHOD_CHANGED,
  CONNECTION_ESTABLISHED,
  CONNECTION_LOST,
  NETWORK_CHANGED,
  ACCOUNTS_CHANGED,
  DEPLOYMENT_LOADING,
  DEPLOYMENT_LOADED,
  DEPLOYMENT_ERROR,
}

export type ConnectionAction =
  | MethodChanged
  | ConnectionEstablished
  | ConnectionLost
  | AccountsChanged
  | NetworkChanged
  | DeploymentLoading
  | DeploymentLoaded
  | DeploymentError;

export interface MethodChanged {
  type: ConnectionActionType.METHOD_CHANGED;
  method: string;
}

export interface ConnectionEstablished {
  type: ConnectionActionType.CONNECTION_ESTABLISHED;
  eth: Eth;
  network?: NetworkEnum;
  accounts?: Address[];
}

export interface ConnectionLost {
  type: ConnectionActionType.CONNECTION_LOST;
}

export interface AccountsChanged {
  type: ConnectionActionType.ACCOUNTS_CHANGED;
  accounts?: Address[];
}

export interface NetworkChanged {
  type: ConnectionActionType.NETWORK_CHANGED;
  network?: NetworkEnum;
}

export interface DeploymentLoading {
  type: ConnectionActionType.DEPLOYMENT_LOADING;
}

export interface DeploymentLoaded {
  type: ConnectionActionType.DEPLOYMENT_LOADED;
  deployment: DeploymentOutput;
}

export interface DeploymentError {
  type: ConnectionActionType.DEPLOYMENT_ERROR;
  error: Error;
}

export function accountsChanged(accounts: Address[]): AccountsChanged {
  return { accounts, type: ConnectionActionType.ACCOUNTS_CHANGED };
}

export function networkChanged(network?: NetworkEnum): NetworkChanged {
  return { network, type: ConnectionActionType.NETWORK_CHANGED };
}

export function methodChanged(method: string): MethodChanged {
  return { method, type: ConnectionActionType.METHOD_CHANGED };
}

export function connectionEstablished(eth: Eth, network?: NetworkEnum, accounts?: Address[]): ConnectionEstablished {
  return { eth, network, accounts, type: ConnectionActionType.CONNECTION_ESTABLISHED };
}

export function connectionLost(): ConnectionLost {
  return { type: ConnectionActionType.CONNECTION_LOST };
}

export function deploymentLoading(): DeploymentLoading {
  return { type: ConnectionActionType.DEPLOYMENT_LOADING };
}

export function deploymentLoaded(deployment: DeploymentOutput): DeploymentLoaded {
  return { deployment, type: ConnectionActionType.DEPLOYMENT_LOADED };
}

export function deploymentError(error: Error): DeploymentError {
  return { error, type: ConnectionActionType.DEPLOYMENT_ERROR };
}

export function reducer(state: ConnectionState, action: ConnectionAction): ConnectionState {
  switch (action.type) {
    case ConnectionActionType.METHOD_CHANGED: {
      return {
        ...state,
        network: undefined,
        deployment: undefined,
        accounts: undefined,
        method: action.method,
      };
    }

    case ConnectionActionType.NETWORK_CHANGED: {
      const deployment = state.network === action.network ? state.deployment : undefined;
      return { ...state, deployment, network: action.network };
    }

    case ConnectionActionType.ACCOUNTS_CHANGED: {
      return { ...state, accounts: action.accounts };
    }

    case ConnectionActionType.CONNECTION_ESTABLISHED: {
      return { ...state, network: action.network, accounts: action.accounts, eth: action.eth };
    }

    case ConnectionActionType.CONNECTION_LOST: {
      return { ...state, network: undefined, accounts: undefined, eth: undefined, method: undefined };
    }

    case ConnectionActionType.DEPLOYMENT_LOADING: {
      return state;
    }

    case ConnectionActionType.DEPLOYMENT_LOADED: {
      return { ...state, deployment: action.deployment };
    }

    case ConnectionActionType.DEPLOYMENT_ERROR: {
      return { ...state, deployment: undefined, error: action.error };
    }

    default: {
      throw new Error('Invalid action.');
    }
  }
}

export interface ConnectionContext {
  environment?: DeployedEnvironment;
  account?: string;
  method?: string;
  status: ConnectionStatus;
  methods: ConnectionMethod[];
  switch: (method: string) => void;
  disconnect: () => void;
}

export const Connection = createContext<ConnectionContext>({} as ConnectionContext);

export interface ConnectionMethodProps {
  select: () => void;
  disconnect: () => void;
  active: boolean;
}

export interface ConnectionMethod {
  name: string;
  label: string;
  component: React.ComponentType<ConnectionMethodProps>;
  connect: () => Rx.Observable<ConnectionAction>;
}

export interface ConnectionProviderProps {
  methods: ConnectionMethod[];
  default: ConnectionMethod;
  disconnect: ConnectionMethod;
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = props => {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    // During local development, the default connection method is fetched from local storage for persistence
    // during testing sessions where the developer wants to refresh the browser window.
    method:
      (process.env.NODE_ENV === 'development' && window.localStorage.getItem('connection.method')) ||
      props.default.name,
  }));

  useEffect(() => {
    // Only store the previously selected connection method on local development.
    if (process.env.NODE_ENV === 'development' && state.method) {
      window.localStorage.setItem('connection.method', state.method);
    }

    if (process.env.NODE_ENV === 'development' && !state.method) {
      window.localStorage.removeItem('connection.method');
    }
  }, [state.method]);

  // Subscribe to the current connection method's observable whenever it changes.
  useEffect(() => {
    const method =
      [...props.methods, props.default, props.disconnect].find(item => item.name === state.method) ?? props.default;
    const observable = method.connect();
    const subscription = observable.subscribe({
      next: action => dispatch(action),
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [props.methods, props.default, state.method]);

  // Load the deployment based on the current network whenever it changes.
  useEffect(() => {
    if (!state.network) {
      return;
    }

    dispatch(deploymentLoading());

    const current = config[state.network];
    const subscription = Rx.from(current.deployment()).subscribe({
      next: deployment => dispatch(deploymentLoaded(deployment)),
      error: error => dispatch(deploymentError(error)),
    });

    return () => subscription.unsubscribe();
  }, [state.network]);

  const status = useMemo(() => {
    if (state.network && state.deployment) {
      return ConnectionStatus.CONNECTED;
    }

    if (state.method) {
      return ConnectionStatus.CONNECTING;
    }

    return ConnectionStatus.OFFLINE;
  }, [state.network, state.method, state.deployment]);

  // Create the environment once the required values are available.
  const environment = useMemo(() => {
    if (state.eth && state.network && state.deployment) {
      return createEnvironment(state.eth, state.deployment, state.network);
    }

    return undefined;
  }, [state.eth, state.network, state.deployment]);

  const account = useMemo(() => {
    return state.accounts && state.accounts[0];
  }, [state.accounts]);

  const disconnect = props.disconnect.name;
  const context: ConnectionContext = {
    environment,
    status,
    account,
    method: state.method,
    methods: props.methods,
    switch: (method: string) => dispatch(methodChanged(method)),
    disconnect: () => dispatch(methodChanged(disconnect)),
  };

  return <Connection.Provider value={context}>{props.children}</Connection.Provider>;
};
