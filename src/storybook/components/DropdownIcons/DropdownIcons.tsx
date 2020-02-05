import React from 'react';
import Select, { components, Props as ReactSelectProps } from 'react-select';
import * as D from './DropdownIcons.styles';
import { useForm, useFormContext, ErrorMessage, Controller } from 'react-hook-form';
import { Icons } from '~/storybook/components/Icons/Icons';

export interface DropdownProps extends ReactSelectProps {
  label?: string;
}

export const DropdownIcons: React.FC<DropdownProps> = ({ options, name, label, ...rest }) => {
  const form = useFormContext();
  const { control } = form;
  // const connected = !!(form && name);
  // const errors = connected ? form.errors : undefined;
  // const error = !!(errors && errors[name!]);

  const Option = (props: any) => {
    return (
      <components.Option {...props}>
        <D.DropdownWithIcons>
          <Icons name={props.label} size="small" />
          {props.label}
        </D.DropdownWithIcons>
      </components.Option>
    );
  };

  console.log(form.watch(name));
  const value = form.watch(name);

  const selected = options?.find(item => item.value === value);

  return (
    <D.DropdownWrapper>
      {label && <D.DropdownLabel>{label}</D.DropdownLabel>}

      <Controller
        as={<Select {...rest} components={{ Option }} options={options} value={selected} />}
        name={name!}
        control={control}
        onChange={([selected]) => selected}
      />

      {/* {error && <ErrorMessage errors={form.errors} name={name!} as={<D.DropdownError />} />} */}
    </D.DropdownWrapper>
  );
};
