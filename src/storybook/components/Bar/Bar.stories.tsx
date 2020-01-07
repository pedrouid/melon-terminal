import React from 'react';
import { Bar, BarContent } from './Bar';

export default { title: 'Atoms|Bar' };

export const Default: React.FC = () => {
  return (
    <Bar>
      <BarContent>
        <div>Content here</div>
        <div>will be</div>
        <div>spaced aligned left and contained</div>
      </BarContent>
    </Bar>
  );
};

export const SpaceBetween: React.FC = () => {
  return (
    <Bar>
      <BarContent justify="between">
        <div>Content here</div>
        <div>will be</div>
        <div>spaced spaced between and full width</div>
      </BarContent>
    </Bar>
  );
};

export const SpaceAround: React.FC = () => {
  return (
    <Bar>
      <BarContent justify="around">
        <div>Content here</div>
        <div>will be</div>
        <div>spaced spaced around</div>
      </BarContent>
    </Bar>
  );
};

export const End: React.FC = () => {
  return (
    <Bar>
      <BarContent justify="end">
        <div>Content here</div>
        <div>will be</div>
        <div>aligned right</div>
      </BarContent>
    </Bar>
  );
};
