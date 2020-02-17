import React from 'react';
// @ts-ignore
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Eth } from 'web3-eth';
import { retryWhen, delay, mapTo, switchMap, map } from 'rxjs/operators';
import * as Rx from 'rxjs';
import {
  connectionEstablished,
  ConnectionMethodProps,
  ConnectionMethod,
  accountsChanged,
  networkChanged,
  connectionLost,
} from '~/components/Contexts/Connection/Connection';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Button } from '~/storybook/components/Button/Button.styles';
import { networkFromId } from '~/utils/networkFromId';

interface EthResource extends Rx.Unsubscribable {
  eth$: Rx.Observable<Eth>;
  provider: WalletConnectProvider;
}

const connect = () => {
  const create = () => {
    const provider = new WalletConnectProvider({
      rpc: {
        1: process.env.MELON_WALLET_CONNECT_PROVIDER,
      },
    });
    const eth = new Eth(provider, undefined, {
      transactionConfirmationBlocks: 1,
    });

    const eth$ = Rx.defer(() => provider.enable()).pipe(mapTo(eth));
    return { eth$, provider, unsubscribe: () => provider.close() };
  };

  return Rx.using(create, resource => {
    const eth$ = (resource as EthResource).eth$;
    const provider = (resource as EthResource).provider;

    const connection$ = eth$.pipe(
      switchMap(async eth => {
        const [id, accounts] = await Promise.all([eth.net.getId(), eth.getAccounts()]);
        const network = networkFromId(id);

        return connectionEstablished(eth, network, accounts);
      }),
      retryWhen(error => error.pipe(delay(1000)))
    );

    const accounts$ = Rx.fromEvent<string[]>(provider, 'accountsChanged').pipe(
      map(accounts => accountsChanged(accounts))
    );

    const network$ = Rx.fromEvent<string>(provider, 'networkChanged').pipe(
      map(id => networkChanged(networkFromId(parseInt(id, 10))))
    );

    return Rx.concat(connection$, Rx.merge(accounts$, network$));
  });
};

export const WalletConnect: React.FC<ConnectionMethodProps> = ({ connect, disconnect, active }) => {
  return (
    <>
      <SectionTitle>WalletConnect</SectionTitle>

      {!active ? (
        <Button length="stretch" onClick={() => connect()}>
          Connect
        </Button>
      ) : (
        <Button length="stretch" onClick={() => disconnect()}>
          Disconnect
        </Button>
      )}
    </>
  );
};

export const method: ConnectionMethod = {
  connect,
  component: WalletConnect,
  icon: 'WALLETCONNECT',
  name: 'walletConnect',
  label: 'WalletConnect',
};
