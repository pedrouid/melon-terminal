import React from 'react';
import * as N from './Navbar.styles';
import { Logo } from '../Logo/Logo';

export interface NavbarProps {
  name: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  return (
    <N.Navbar>
      <Logo name="with-bottom-text" size="small" />
    </N.Navbar>
  );
};
