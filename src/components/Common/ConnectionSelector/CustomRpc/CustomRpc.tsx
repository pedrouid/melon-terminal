import React, { useState } from 'react';
import * as Rx from 'rxjs';
import * as R from 'ramda';
import { switchMap, expand, distinctUntilChanged } from 'rxjs/operators';
import { Eth } from 'web3-eth';
import { networkFromId } from '~/utils/networkFromId';
import { createEnvironment, Environment, createProvider } from '~/environment';
import { HttpProvider, WebsocketProvider } from 'web3-providers';
import { ConnectionMethod } from '~/components/Contexts/Connection';

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

const connect = ({ endpoint }: { endpoint: string }): Rx.Observable<Environment> => {
  const createResource = (): EthResource => {
    const provider = createProvider(endpoint);
    const eth = new Eth(provider, undefined, {
      transactionConfirmationBlocks: 1,
    });

    return {
      eth,
      unsubscribe: () => {
        if (provider instanceof HttpProvider) {
          provider.disconnect();
        }

        if (provider instanceof WebsocketProvider) {
          provider.disconnect(1000, 'Connection closed by client.');
        }
      },
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

export const CustomRpc: React.FC<any> = ({ select, active, config }) => {
  const [endpoint, setEndpoint] = useState(config.endpoint || 'http://localhost:8545');

  return (
    <div>
      <h2>Custom endpoint</h2>
      <input type="text" onChange={e => setEndpoint(e.target.value)} value={endpoint} />
      <button onClick={() => select({ endpoint })}>Connect</button>
    </div>
  );
};

export const method: ConnectionMethod = {
  connect,
  component: CustomRpc,
  name: 'CustomRpc',
};
