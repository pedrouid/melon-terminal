import React from 'react';
import {
  CheckboxContainer,
  CheckboxInput,
  CheckboxMask,
  CheckboxIcon,
  CheckboxLabel,
} from '~/storybook/components/Checkbox/Checkbox';

export default { title: 'Atoms|Checkbox' };

export const Default: React.FC = () => {
  return (
    <CheckboxContainer>
      <CheckboxLabel htmlFor="idcheckbox">I'm a label</CheckboxLabel>

      <CheckboxMask>
        <CheckboxInput type="checkbox" id="idcheckbox" name="my_checkbox" value="1" />

        <CheckboxIcon></CheckboxIcon>
      </CheckboxMask>
    </CheckboxContainer>
  );
};

export const Disabled: React.FC = () => {
  return (
    <CheckboxContainer>
      <CheckboxInput type="checkbox" id="idcheckbox" name="my_checkbox" value="1" disabled={true} />
      <CheckboxMask>
        <CheckboxIcon></CheckboxIcon>
      </CheckboxMask>
      <CheckboxLabel htmlFor="idcheckbox">I'm a label</CheckboxLabel>
    </CheckboxContainer>
  );
};

export const DisabledChecked: React.FC = () => {
  return (
    <CheckboxContainer>
      <CheckboxInput type="checkbox" id="idcheckbox" name="my_checkbox" value="1" disabled={true} checked />
      <CheckboxMask>
        <CheckboxIcon></CheckboxIcon>
      </CheckboxMask>
      <CheckboxLabel htmlFor="idcheckbox">I'm a label</CheckboxLabel>
    </CheckboxContainer>
  );
};
