import React from 'react';
import { Icons } from '~/storybook/components/Icons/Icons';

export interface TwitterLinkProps {
  name?: string;
  manager?: boolean;
}

export const TwitterLink: React.FC<TwitterLinkProps> = ({ name, manager }) => {
  const base = 'https://twitter.com/intent/tweet?text=';
  const textAsManager = `Check%20out%20my%20on-chain%20fund%20on%20Melon%20${name}%20`;
  const other = `Check%20out%20this%20interesting%20on-chain%20fund%20on%20Melon%20${name}%20`;
  const link = `${base}${manager ? textAsManager : other} ${window.location.href}`;

  return (
    <a href={link} target="_blank">
      <Icons name="TWITTER" size="small" />
    </a>
  );
};
