import React from 'react';
import * as Rx from 'rxjs';
import { Eth } from 'web3-eth';
import { HttpProvider } from 'web3-providers';
import {
  ConnectionMethod,
  ConnectionAction,
  connectionEstablished,
  ConnectionMethodProps,
} from '~/components/Contexts/Connection/Connection';
import { map, retryWhen, delay, take, share } from 'rxjs/operators';
import { networkFromId } from '~/utils/networkFromId';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Button } from '~/storybook/components/Button/Button';

interface EthResource extends Rx.Unsubscribable {
  eth: Eth;
}

const connect = (): Rx.Observable<ConnectionAction> => {
  const create = (): EthResource => {
    const provider = new HttpProvider(process.env.MELON_DEFAULT_PROVIDER);
    const eth = new Eth(provider, undefined, {
      transactionConfirmationBlocks: 1,
    });

    return { eth, unsubscribe: () => provider.disconnect() };
  };

  return Rx.using(create, resource => {
    const eth = (resource as EthResource).eth;
    const connect$ = Rx.defer(async () => networkFromId(await eth.net.getId())).pipe(
      retryWhen(error => error.pipe(delay(10000))),
      take(1),
      share()
    );

    const initial$ = connect$.pipe(map(network => connectionEstablished(eth, network)));
    return initial$;
  });
};

export const Anonymous: React.FC<ConnectionMethodProps> = ({ connect, active }) => {
  return (
    <>
      <SectionTitle>Anonymous</SectionTitle>
      {!active ? (
        <Button length="stretch" onClick={() => connect()}>
          Connect
        </Button>
      ) : (
        <span>Currently selected</span>
      )}
    </>
  );
};

export const method: ConnectionMethod = {
  connect,
  supported: () => true,
  component: Anonymous,
  name: 'anonymous',
  label: 'Anonymous',
};
