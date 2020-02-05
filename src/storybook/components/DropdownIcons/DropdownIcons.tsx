import React from 'react';
import Select, { components, OptionProps, Props as ReactSelectProps, SingleValueProps } from 'react-select';
import { useFormContext, ErrorMessage, Controller } from 'react-hook-form';
import { Icons } from '~/storybook/components/Icons/Icons';
import * as D from './DropdownIcons.styles';

export interface DropdownIconsOptionType {
  value: string;
  label: string;
}

export interface DropdownIconsProps extends ReactSelectProps<DropdownIconsOptionType> {
  label?: string;
}

// TODO: Rename to ReactSelectInput.
// TODO: This is currently blocked by https://github.com/react-hook-form/react-hook-form/pull/976
export const DropdownIcons: React.FC<DropdownIconsProps> = ({ options, name, label, ...rest }) => {
  const form = useFormContext();
  const connected = !!(form && name);
  const errors = connected ? form.errors : undefined;
  const error = !!(errors && errors[name!]);

  const Option = (props: OptionProps<DropdownIconsOptionType>) => {
    return (
      <components.Option {...props}>
        <D.DropdownWithIcons>
          {/* TODO: Move the full label definition (including icon) to the label value. */}
          <Icons name={props.label as any} size="small" />
          {props.label}
        </D.DropdownWithIcons>
      </components.Option>
    );
  };

  const SingleValue = (props: SingleValueProps<DropdownIconsOptionType>) => {
    return (
      <components.SingleValue {...props}>
        <D.DropdownWithIcons>
          {/* TODO: Move the full label definition (including icon) to the label value. */}
          <Icons name={props.data.label as any} size="small" />
          {props.data.label}
        </D.DropdownWithIcons>
      </components.SingleValue>
    );
  };

  const candidates = (options && Array.isArray(options) ? options : []) as DropdownIconsOptionType[];

  return (
    <D.DropdownWrapper>
      {label && <D.DropdownLabel>{label}</D.DropdownLabel>}

      {connected ? (
        <Controller
          as={<Select components={{ Option, SingleValue }} options={options} {...rest} />}
          name={name!}
          control={form.control}
          // TODO: Re-add this once https://github.com/react-hook-form/react-hook-form/pull/976 is merged.
          // valueTransformer={value => candidates.find(item => item.value === value)}
          onChange={([selected]) => ({ value: selected })}
          // onChange={([selected]) => selected}
        />
      ) : (
        <Select components={{ Option }} options={options} {...rest} />
      )}

      {error && <ErrorMessage errors={form.errors} name={name!} as={<D.DropdownError />} />}
    </D.DropdownWrapper>
  );
};
