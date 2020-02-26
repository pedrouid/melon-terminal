import React from 'react';
// @ts-ignore
import Fortmatic from 'fortmatic';
import { Eth } from 'web3-eth';
import { retryWhen, delay } from 'rxjs/operators';
import * as Rx from 'rxjs';
import {
  connectionEstablished,
  ConnectionMethodProps,
  ConnectionMethod,
} from '~/components/Contexts/Connection/Connection';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Button } from '~/storybook/components/Button/Button.styles';
import { networkFromId } from '~/utils/networkFromId';
import { getConfig } from '~/config';
import { NetworkEnum } from '~/types';

interface EthResource extends Rx.Unsubscribable {
  eth: Eth;
}

const connect = () => {
  const config = getConfig(NetworkEnum.MAINNET)!;
  const customNodeOptions = {
    rpcUrl: config.provider,
    chainId: 1,
  };

  const fm = new Fortmatic(process.env.MELON_FORTMATIC_KEY, customNodeOptions);
  const provider = fm.getProvider();
  getConfig;
  const create = () => {
    const eth = new Eth(provider, undefined, {
      transactionConfirmationBlocks: 1,
    });
    return { eth, unsubscribe: () => fm.user.logout() };
  };

  return Rx.using(create, resource => {
    const eth = (resource as EthResource).eth;

    const connection$ = Rx.defer(async () => {
      const [id, accounts] = await Promise.all([eth.net.getId(), eth.getAccounts()]);
      const network = networkFromId(id);

      return connectionEstablished(eth, network, accounts);
    }).pipe(retryWhen(error => error.pipe(delay(1000))));

    return Rx.concat(connection$, Rx.NEVER);
  });
};

export const FortmaticComponent: React.FC<ConnectionMethodProps> = ({ connect, disconnect, active }) => {
  return (
    <>
      <SectionTitle>Fortmatic</SectionTitle>

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
  supported: () => !!getConfig(NetworkEnum.MAINNET),
  component: FortmaticComponent,
  icon: 'FORTMATIC',
  name: 'fortmatic',
  label: 'Fortmatic',
};
