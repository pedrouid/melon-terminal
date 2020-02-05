import React from 'react';
import { DropdownIcons } from './DropdownIcons';
import { FormContext, useForm } from 'react-hook-form';
import Select from 'react-select';

const options = [
  { value: 'weth', label: 'WETH' },
  { value: 'mln', label: 'MLN' },
];

export default { title: 'Atoms|DropdownIcons' };

export const Default: React.FC = () => {
  const form = useForm();

  return (
    <FormContext {...form}>
      <DropdownIcons name="select" options={options} value={options[0]} />
    </FormContext>
  );
};
