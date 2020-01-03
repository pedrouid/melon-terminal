import React from 'react';
import * as D from './Dropdown.styles';

export interface DropdownProps {
  disabled?: boolean;
  label?: string;
  name: string;
  value?: string;
  options: { value: string; name: string }[];
}

export const Dropdown: React.FC<DropdownProps> = props => {
  return (
    <D.DropdownWrapper>
      <D.DropdownSelect name={props.name} value={props.value} disabled={props.disabled}>
        {props.options &&
          props.options.map((item, index) => (
            <option key={index} value={item.value}>
              {item.name}
            </option>
          ))}
      </D.DropdownSelect>
    </D.DropdownWrapper>
  );
};
