import React, { useState, useEffect } from 'react';
import { useConnectionState } from '~/hooks/useConnectionState';
import * as S from './ConnectionSelector.styles';
import { useHistory } from 'react-router';
import { ConnectionStatus } from '~/components/Contexts/Connection/Connection';

export const ConnectionSelector: React.FC = () => {
  const history = useHistory();
  const connection = useConnectionState();
  const [method, setMethod] = useState<string>();

  useEffect(() => {
    if (connection.status === ConnectionStatus.CONNECTED && connection.method === method) {
      history.replace('/');
    }
  }, [connection.status, connection.method]);

  return (
    <>
      {connection.methods.map(method => {
        const Component = method.component;
        const active = method.name === connection.method;
        const select = () => {
          setMethod(method.name);
          connection.switch(method.name);
        };

        return (
          <S.Method key={method.name}>
            <Component active={active} select={select} />
          </S.Method>
        );
      })}
    </>
  );
};
