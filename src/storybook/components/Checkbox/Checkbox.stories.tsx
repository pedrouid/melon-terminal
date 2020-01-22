import React from 'react';
import { Checkbox } from '~/storybook/components/Checkbox/Checkbox';

export default { title: 'Atoms|Checkbox' };

export const Default: React.FC = () => {
  return <Checkbox label="I'm a label" />;
};

export const Disabled: React.FC = () => {
  return <Checkbox label="I'm a label" disabled={true} />;
};

export const DisabledChecked: React.FC = () => {
  return <Checkbox label="I'm a label" disabled={true} checked={true} />;
};
