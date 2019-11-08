import React from 'react';
import * as Rx from 'rxjs';
import { Eth } from 'web3-eth';
import { HttpProvider } from 'web3-providers';
import {
  ConnectionMethod,
  ConnectionAction,
  networkChanged,
  accountsChanged,
  connectionEstablished,
} from '~/components/Contexts/Connection';
import { map, expand, switchMap, concatMap, retryWhen, retry, delay } from 'rxjs/operators';
import { networkFromId } from '~/utils/networkFromId';

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

const connect = (): Rx.Observable<ConnectionAction> => {
  const create = (): EthResource => {
    const provider = new HttpProvider('http://localhost:1248');
    const eth = new Eth(provider, undefined, {
      transactionConfirmationBlocks: 1,
    });

    return { eth, unsubscribe: () => provider.disconnect() };
  };

  return Rx.using(create, resource => {
    const eth = (resource as EthResource).eth;
    const enable$ = Rx.defer(async () => {
      const [id, accounts] = await Promise.all([eth.net.getId(), eth.getAccounts()]);
      const network = networkFromId(id);
      return connectionEstablished(eth, network, accounts);
    }).pipe(retryWhen(error => error.pipe(delay(1000))));

    const accounts$ = Rx.EMPTY.pipe(
      expand(() => Rx.timer(10000).pipe(concatMap(() => eth.getAccounts()))),
      map(accounts => accountsChanged(accounts))
    );

    const network$ = Rx.EMPTY.pipe(
      expand(() => Rx.timer(10000).pipe(concatMap(() => eth.net.getId()))),
      map(id => networkChanged(networkFromId(id)))
    );

    return Rx.concat(enable$, Rx.merge(network$, accounts$));
  });
};

export const Frame: React.FC<any> = ({ select, active }) => {
  return (
    <div>
      <h2>Frame</h2>
      {!active ? <button onClick={() => select()}>Connect</button> : <div>Currently selected</div>}
    </div>
  );
};

export const method: ConnectionMethod = {
  connect,
  component: Frame,
  name: 'Frame',
};
