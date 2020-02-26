import React from 'react';
// @ts-ignore
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Eth } from 'web3-eth';
import { map, switchMap, mapTo } from 'rxjs/operators';
import * as Rx from 'rxjs';
import {
  networkChanged,
  accountsChanged,
  connectionEstablished,
  ConnectionMethodProps,
  ConnectionMethod,
} from '~/components/Contexts/Connection/Connection';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Button } from '~/storybook/components/Button/Button.styles';
import { networkFromId } from '~/utils/networkFromId';

interface EthResource extends Rx.Unsubscribable {
  eth: Eth;
}

// melon default provider
const connect = () => {
  const customNodeOptions = {
    infuraId: process.env.MELON_WALLETCONNECT_INFURA_ID,
  };

  const provider = new WalletConnectProvider(customNodeOptions);

  const create = () => {
    const eth = new Eth(provider, undefined, {
      transactionConfirmationBlocks: 1,
    });
    return { eth, unsubscribe: () => provider.close() };
  };

  return Rx.using(create, resource => {
    const eth = (resource as EthResource).eth;

    const enable$ = Rx.defer(() => provider.enable() as Promise<string[]>);
    const timer$ = Rx.timer(100).pipe(mapTo([]));
    const initial$ = Rx.race(enable$, timer$).pipe(
      switchMap(async accounts => {
        const network = networkFromId(await eth.net.getId());
        return connectionEstablished(eth, network, accounts);
      })
    );

    const network$ = Rx.fromEvent<string>(provider, 'networkChanged').pipe(
      map(id => networkChanged(networkFromId(parseInt(id, 10))))
    );

    const accounts$ = Rx.concat(enable$, Rx.fromEvent<string[]>(provider, 'accountsChanged')).pipe(
      map(accounts => accountsChanged(accounts))
    );
    return Rx.concat(initial$, Rx.merge(accounts$, network$));
  });
};

export const WalletConnectComponent: React.FC<ConnectionMethodProps> = ({ connect, disconnect, active }) => {
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
  supported: () => true,
  component: WalletConnectComponent,
  icon: 'WALLETCONNECT',
  name: 'walletconnect',
  label: 'WalletConnect',
};
