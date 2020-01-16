import React from 'react';
import * as Rx from 'rxjs';
import { equals } from 'ramda';
import { Eth } from 'web3-eth';
import { HttpProvider } from 'web3-providers';
import {
  ConnectionMethod,
  ConnectionAction,
  networkChanged,
  connectionEstablished,
} from '~/components/Contexts/Connection/Connection';
import {
  map,
  expand,
  concatMap,
  retryWhen,
  delay,
  take,
  distinctUntilChanged,
  share,
  skip,
  catchError,
  tap,
} from 'rxjs/operators';
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
      retryWhen(error => error.pipe(delay(1000))),
      take(1),
      share()
    );

    const enable$ = connect$.pipe(map((network) => connectionEstablished(eth, network)));
    const network$ = connect$.pipe(
      expand(() =>
        Rx.timer(1000).pipe(
          concatMap(() => eth.net.getId()),
          map(id => networkFromId(id)),
          catchError(() => Rx.of(undefined))
        )
      ),
      distinctUntilChanged((a, b) => equals(a, b)),
      map(network => networkChanged(network)),
      skip(1)
    );

    return Rx.concat(enable$, network$).pipe(tap((value) => console.log(value)));
  });
};

export const Anonymous: React.FC<any> = ({ select, active }) => {
  return (
    <>
      <SectionTitle>Anonymous</SectionTitle>
      {!active ? (
        <Button lenght="stretch" onClick={() => select()}>
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
  component: Anonymous,
  name: 'anonymous',
  label: 'Anonymous',
};
