import React from 'react';
import * as Rx from 'rxjs';
import { retryWhen, delay } from 'rxjs/operators';
import { Eth } from 'web3-eth';
import { HttpProvider } from 'web3-providers';
import { networkFromId } from '~/utils/networkFromId';
import {
  connectionEstablished,
  ConnectionAction,
  ConnectionMethod,
  ConnectionMethodProps,
} from '~/components/Contexts/Connection/Connection';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Button } from '~/storybook/components/Button/Button';

interface EthResource extends Rx.Unsubscribable {
  eth: Eth;
}

const connect = (): Rx.Observable<ConnectionAction> => {
  const create = (): EthResource => {
    const provider = new HttpProvider(process.env.MELON_TESTNET_PROVIDER);
    const eth = new Eth(provider, undefined, {
      transactionConfirmationBlocks: 1,
    });

    return { eth, unsubscribe: () => provider.disconnect() };
  };

  return Rx.using(create, resource => {
    const eth = (resource as EthResource).eth;

    const connection$ = Rx.defer(async () => {
      const [id, accounts] = await Promise.all([eth.net.getId(), eth.getAccounts()]);
      const network = networkFromId(id);
      return connectionEstablished(eth, network, accounts);
    }).pipe(retryWhen(error => error.pipe(delay(1000))));

    return connection$;
  });
};

export const Ganache: React.FC<ConnectionMethodProps> = ({ select, disconnect, active }) => {
  return (
    <>
      <SectionTitle>Ganache</SectionTitle>

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
  component: Ganache,
  name: 'ganache',
  label: 'Ganache',
};
