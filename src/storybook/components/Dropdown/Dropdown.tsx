import React from 'react';
import * as D from './Dropdown.styles';
import { useFormContext } from 'react-hook-form';

export interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; name: string }[];
}

export const Dropdown: React.FC<DropdownProps> = ({ options, ...rest }) => {
  const form = useFormContext();

  return (
    <D.DropdownWrapper>
      <D.DropdownSelect ref={form && form.register} {...rest}>
        {(options ?? []).map((item, index) => (
          <option key={index} value={item.value}>
            {item.name}
          </option>
        ))}
      </D.DropdownSelect>
    </D.DropdownWrapper>
  );
};
