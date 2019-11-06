import React, { useContext } from 'react';
import { OnChainContext } from '~/components/Contexts/Connection';

export const ConnectionSelector: React.FC = () => {
  const context = useContext(OnChainContext);

  return (
    <>
      {context.methods.map(method => {
        const Component = method.component;
        const active = method.name === context.method;
        const select = (config: any) => {
          context.select(method.name, config);
        };

        return <Component active={active} config={active && context.config} select={select} />;
      })}
    </>
  );
};
