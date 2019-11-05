import React, { useContext } from 'react';
import * as Rx from 'rxjs';
import { createPath } from 'history';
import { useLocation, useHistory } from 'react-router';
import { ConnectionProviderEnum, OnChainContext } from '~/components/Contexts/Connection';
import { MetaMask } from './MetaMask/MetaMask';
import { CustomRpc } from './CustomRpc/CustomRpc';
import { Frame } from './Frame/Frame';
import * as S from './ConnectionSelector.styles';
import { Environment } from '~/environment';

export interface ConnectionMethodProps {
  active: boolean;
  set: (connection: Rx.Observable<Environment>) => void;
}

export const ConnectionSelector: React.FC = () => {
  const context = useContext(OnChainContext);
  const history = useHistory();
  const location = useLocation();

  const set = (provider: ConnectionProviderEnum, connection: Rx.Observable<Environment>) => {
    context.set(provider, connection);

    if (location.state && location.state.redirect) {
      const path = createPath(location.state.redirect);
      // TODO: Add proper logic to filter out paths that are personalized.
      if (path && !path.startsWith('/wallet')) {
        return history.replace(location.state.redirect);
      }
    }

    history.push('/');
  };

  return (
    <>
      <S.Method>
        <MetaMask
          active={context.provider === ConnectionProviderEnum.METAMASK}
          set={connection => set(ConnectionProviderEnum.METAMASK, connection)}
        />
      </S.Method>

      <S.Method>
        <Frame
          active={context.provider === ConnectionProviderEnum.FRAME}
          set={connection => set(ConnectionProviderEnum.FRAME, connection)}
        />
      </S.Method>

      <S.Method>
        <CustomRpc
          active={context.provider === ConnectionProviderEnum.CUSTOM}
          set={connection => set(ConnectionProviderEnum.CUSTOM, connection)}
        />
      </S.Method>
    </>
  );
};
