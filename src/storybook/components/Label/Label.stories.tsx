import React from 'react';
import { Label, LabelSideInfo } from './Label';

export default { title: 'Atoms|Label' };

export const Default = () => <Label>default label</Label>;

export const SideInfo = () => (
  <Label>
    default label <LabelSideInfo>side info</LabelSideInfo>
  </Label>
);
