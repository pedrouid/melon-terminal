import React from 'react';
// @ts-ignore
import WalletConnectProvider from '@walletconnect/web3-provider';
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

    const connection$ = Rx.defer(async () => {
      await provider.enable();
      const [id, accounts] = await Promise.all([eth.net.getId(), eth.getAccounts()]);
      const network = networkFromId(id);

      return connectionEstablished(eth, network, accounts);
    }).pipe(retryWhen(error => error.pipe(delay(1000))));

    return Rx.concat(connection$, Rx.NEVER);
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
