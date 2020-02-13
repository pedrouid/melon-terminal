import React from 'react';
import { ModalProvider } from 'styled-react-modal';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from './Layout/Layout';
import { Theme, ModalBackground } from './App.styles';
import { ApolloProvider } from './Contexts/Apollo/Apollo';
import { ConnectionProvider } from './Contexts/Connection/Connection';
import { AccountProvider } from './Contexts/Account/Account';
import { PageTitleProvider } from './Contexts/PageTitle/PageTitle';

// NOTE: Imported using root relative import to allow overrides with webpack.
import { AppRouter } from '~/components/AppRouter';

// TODO: Consider excluding ganache in production builds entirely.
import { method as metamask } from './Layout/ConnectionSelector/MetaMask/MetaMask';
import { method as frame } from './Layout/ConnectionSelector/Frame/Frame';
import { method as ganache } from './Layout/ConnectionSelector/Ganache/Ganache';
import { method as fortmatic } from './Layout/ConnectionSelector/Fortmatic/Fortmatic';
import { method as anonymous } from './Layout/ConnectionSelector/Anonymous/Anonymous';

const AppComponent = () => {
  const start = process.env.MELON_TESTNET ? ganache : anonymous;
  const methods = process.env.MELON_TESTNET ? [ganache, metamask, frame, fortmatic] : [metamask, frame, fortmatic];

  return (
    <Router>
      <Theme>
        <PageTitleProvider>
          <ModalProvider backgroundComponent={ModalBackground}>
            <ConnectionProvider methods={methods} default={start} disconnect={anonymous}>
              <ApolloProvider>
                <AccountProvider>
                  <Layout>
                    <AppRouter />
                  </Layout>
                </AccountProvider>
              </ApolloProvider>
            </ConnectionProvider>
          </ModalProvider>
        </PageTitleProvider>
      </Theme>
    </Router>
  );
};

export const App = AppComponent;
