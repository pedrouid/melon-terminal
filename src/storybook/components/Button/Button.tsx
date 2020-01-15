import React from 'react';
import * as S from './Button.styles';
import { SpinIcon } from '../SpinIcon/SpinIcon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'large' | 'small';
  lenght?: 'stretch';
  kind?: 'secondary' | 'warning' | 'danger' | 'success';
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ loading, children, ...props }) => (
  <S.Button {...props}>
    {children}
    {loading && (<SpinIcon />)}
  </S.Button>
);
