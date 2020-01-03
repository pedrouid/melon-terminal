import React from 'react';
import { Dropdown } from './Dropdown';

const data = {
  name: 'name',
  options: [
    { value: 'one', name: 'One' },
    { value: 'two', name: 'Two' },
  ],
};

export default { title: 'Atoms|Dropdown' };

export const Default: React.FC = () => <Dropdown {...data} />;
