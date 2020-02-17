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
  const provider = new WalletConnectProvider({
    rpc: {
      1: 'https://mainnet.infura.io/v3/b39a0d1b493b42fd8d9bdc8f91d2d0bb',
    },
  });

  provider.enable();

  console.log(provider);

  const create = () => {
    const eth = new Eth(provider, undefined, {
      transactionConfirmationBlocks: 1,
    });

    console.log(eth);
    return {
      eth,
      unsubscribe: () => {
        console.log('WRONG CALL');
        return provider.close();
      },
    };
  };

  return Rx.using(create, resource => {
    const eth = (resource as EthResource).eth;

    console.log(eth);

    const connection$ = Rx.defer(async () => {
      const [id, accounts] = await Promise.all([eth.net.getId(), eth.getAccounts()]);
      console.log(id, accounts);
      const network = networkFromId(id);

      return connectionEstablished(eth, network, accounts);
    }).pipe(retryWhen(error => error.pipe(delay(1000))));

    return connection$;
  });
};

export const WalletConnect: React.FC<ConnectionMethodProps> = ({ connect, disconnect, active }) => {
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
  component: WalletConnect,
  icon: 'WALLETCONNECT',
  name: 'walletConnect',
  label: 'WalletConnect',
};
