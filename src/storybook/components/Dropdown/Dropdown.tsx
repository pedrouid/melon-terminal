import React from 'react';
import * as D from './Dropdown.styles';
import { useFormContext, ErrorMessage } from 'react-hook-form';

export interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; name: string }[];
  label?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ options, name, label, ...rest }) => {
  const form = useFormContext();
  const connected = !!(form && name);
  const ref = connected ? form.register : undefined;
  const errors = connected ? form.errors : undefined;
  const error = !!(errors && errors[name!]);

  return (
    <D.DropdownWrapper>
      {label && <D.DropdownLabel>{label}</D.DropdownLabel>}

      <D.DropdownSelectContainer disabled={rest.disabled} error={error}>
        <D.DropdownSelect ref={ref} name={name} {...rest}>
          {(options ?? []).map((item, index) => (
            <option key={index} value={item.value}>
              {item.name}
            </option>
          ))}
        </D.DropdownSelect>
      </D.DropdownSelectContainer>

      {error && <ErrorMessage errors={form.errors} name={name!} as={D.DropdownError} />}
    </D.DropdownWrapper>
  );
};
