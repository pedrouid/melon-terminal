import React from 'react';
import { useFormContext } from 'react-hook-form';
import * as S from './Input.styles';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ name, ...rest }) => {
  const form = useFormContext();
  const connected = !!(form && name);
  const ref = connected ? form.register : undefined;

  return <S.Input ref={ref} name={name} {...rest} />;
};
