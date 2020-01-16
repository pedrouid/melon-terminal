import React from 'react';
import * as Rx from 'rxjs';
import { map, switchMap, mapTo } from 'rxjs/operators';
import { Eth } from 'web3-eth';
import { networkFromId } from '~/utils/networkFromId';
import {
  networkChanged,
  accountsChanged,
  connectionEstablished,
  ConnectionAction,
  ConnectionMethod,
  ConnectionMethodProps,
} from '~/components/Contexts/Connection/Connection';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Button } from '~/storybook/components/Button/Button';

const connect = (): Rx.Observable<ConnectionAction> => {
  const ethereum = (window as any).ethereum;
  if (typeof ethereum === 'undefined') {
    return Rx.NEVER;
  }

  const eth = new Eth(ethereum, undefined, {
    transactionConfirmationBlocks: 1,
  });

  const enable$ = Rx.defer(() => ethereum.enable() as Promise<string[]>);
  const timer$ = Rx.timer(100).pipe(mapTo([]));
  const initial$ = Rx.race(enable$, timer$).pipe(
    switchMap(async accounts => {
      const network = networkFromId(await eth.net.getId());
      return connectionEstablished(eth, network, accounts);
    })
  );

  const network$ = Rx.fromEvent<string>(ethereum, 'networkChanged').pipe(
    map(id => networkChanged(networkFromId(parseInt(id, 10))))
  );

  const accounts$ = Rx.concat(enable$, Rx.fromEvent<string[]>(ethereum, 'accountsChanged')).pipe(
    map(accounts => accountsChanged(accounts))
  );

  return Rx.concat(initial$, Rx.merge(accounts$, network$));
};

export const MetaMask: React.FC<ConnectionMethodProps> = ({ select, disconnect, active }) => {
  return (
    <>
      <SectionTitle>Metamask</SectionTitle>
      {!active ? (
        <Button lenght="stretch" onClick={() => select()}>
          Connect
        </Button>
      ) : (
          <Button lenght="stretch" onClick={() => disconnect()}>
            Disconnect
        </Button>
        )}
    </>
  );
};

export const method: ConnectionMethod = {
  connect,
  component: MetaMask,
  name: 'metamask',
  label: 'MetaMask',
};
