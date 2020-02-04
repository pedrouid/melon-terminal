import React from 'react';
import Select, { components, Props as ReactSelectProps } from 'react-select';
import * as D from './DropdownIcons.styles';
import { useFormContext, ErrorMessage } from 'react-hook-form';
import { Icons } from '~/storybook/components/Icons/Icons';

export interface DropdownProps extends ReactSelectProps {
  label?: string;
}

export const DropdownIcons: React.FC<DropdownProps> = ({ name, label, ...rest }) => {
  const form = useFormContext();
  const connected = !!(form && name);
  const ref = connected ? form.register : undefined;
  const errors = connected ? form.errors : undefined;
  const error = !!(errors && errors[name!]);

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

  return (
    <D.DropdownWrapper>
      {label && <D.DropdownLabel>{label}</D.DropdownLabel>}

      <Select {...rest} ref={ref} components={{ Option }} />

      {error && <ErrorMessage errors={form.errors} name={name!} as={<D.DropdownError />} />}
    </D.DropdownWrapper>
  );
};
