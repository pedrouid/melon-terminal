import React from 'react';
import { Foo } from './Foo';

export default { title: 'Foo' };

export const HelloBeatriz: React.FC = () => <Foo name="Beatriz" />;

export const HelloSebastian: React.FC = () => <Foo name="Sebastian" />;
