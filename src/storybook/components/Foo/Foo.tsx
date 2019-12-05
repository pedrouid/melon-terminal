import React from 'react';

export interface FooProps {
  name: string;
}

export const Foo: React.FC<FooProps> = props => <div>Hello {props.name}!</div>;
