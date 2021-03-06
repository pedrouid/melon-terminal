import React from 'react';
import * as Rx from 'rxjs';
import { map, switchMap, mapTo } from 'rxjs/operators';
import { Eth } from 'web3-eth';
import { networkFromId } from '~/utils/networkFromId';
import {
  connectionEstablished,
  ConnectionAction,
  ConnectionMethod,
  ConnectionMethodProps,
} from '~/components/Contexts/Connection/Connection';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Button } from '~/storybook/components/Button/Button';

const supported = () => {
  const ethereum = (window as any).ethereum;
  return !!(ethereum && ethereum.isCoinbaseWallet);
};

const connect = (): Rx.Observable<ConnectionAction> => {
  const ethereum = (window as any).ethereum;
  if (!ethereum || !ethereum.isCoinbaseWallet) {
    return Rx.NEVER;
  }

  const eth = new Eth(ethereum, undefined, {
    transactionConfirmationBlocks: 1,
  });

  const enable$ = Rx.defer(() => ethereum.enable() as Promise<string[]>);
  const initial$ = enable$.pipe(
    switchMap(async accounts => {
      const network = networkFromId(await eth.net.getId());
      return connectionEstablished(eth, network, accounts);
    })
  );

  return initial$;
};

export const Coinbase: React.FC<ConnectionMethodProps> = ({ connect, disconnect, active }) => {
  return (
    <>
      <SectionTitle>Coinbase</SectionTitle>
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
  supported,
  component: Coinbase,
  name: 'coinbase',
  label: 'Coinbase',
};
