import React from 'react';
import * as Rx from 'rxjs';
import * as R from 'ramda';
import { switchMap, expand, distinctUntilChanged } from 'rxjs/operators';
import { Eth } from 'web3-eth';
import { HttpProvider } from 'web3-providers';
import { ConnectionMethodProps } from '~/components/Common/ConnectionSelector/ConnectionSelector';
import { networkFromId } from '~/utils/networkFromId';
import { Environment, createEnvironment } from '~/environment';

interface EthResource extends Rx.Unsubscribable {
  eth: Eth;
}

const checkConnection = async (eth: Eth) => {
  const [id, accounts] = await Promise.all([
    eth.net.getId().catch(() => undefined),
    eth.getAccounts().catch(() => undefined),
  ]);

  const network = networkFromId(id);
  return { eth, network, account: accounts && accounts[0] };
};

const connect = (): Rx.Observable<Environment> => {
  const createResource = (): EthResource => {
    const provider = new HttpProvider('http://localhost:1248');
    const eth = new Eth(provider, undefined, {
      transactionConfirmationBlocks: 1,
    });

    return {
      eth,
      unsubscribe: () => provider.disconnect(),
    };
  };

  return Rx.using(createResource, resource => {
    return Rx.of((resource as EthResource).eth).pipe(
      switchMap(eth => checkConnection(eth)),
      expand(connection => Rx.timer(10000).pipe(switchMap(() => checkConnection(connection.eth)))),
      distinctUntilChanged((a, b) => R.equals(a, b)),
      switchMap(connection => createEnvironment(connection.eth, connection.network, connection.account))
    );
  });
};

export const Frame: React.FC<ConnectionMethodProps> = ({ set, active }) => {
  return (
    <div>
      <h2>Frame</h2>
      {!active && <button onClick={() => set(connect())}>Connect</button>}
    </div>
  );
};
