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

export const Button: React.FC<ButtonProps> = props => {
  return (
    <S.Button kind={props.kind} size={props.size} lenght={props.lenght}  disabled={props.disabled} loading={props.loading}>
      {props.children}
      {props.loading && (<SpinIcon />)}
    </S.Button>
  );
};
