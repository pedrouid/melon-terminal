import React from 'react';
import { useConnectionState } from '~/hooks/useConnectionState';
import * as S from './ConnectionSelector.styles';

export const ConnectionSelector: React.FC = () => {
  const connection = useConnectionState();

  return (
    <>
      {connection.methods.map(method => {
        const Component = method.component;
        const active = method.name === connection.method;
        const select = () => connection.switch(method.name);

        return (
          <S.Method key={method.name}>
            <Component active={active} select={select} />
          </S.Method>
        );
      })}
    </>
  );
};
