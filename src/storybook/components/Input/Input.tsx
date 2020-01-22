import React from 'react';
import { useFormContext, ErrorMessage } from 'react-hook-form';
import * as S from './Input.styles';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ name, label, ...rest }) => {
  const form = useFormContext();
  const connected = !!(form && name);
  const ref = connected ? form.register : undefined;
  const errors = connected ? form.errors : undefined;
  const error = !!(errors && errors[name!]);

  return (
    <S.InputWrapper>
      {label && <S.InputLabel>{label}</S.InputLabel>}
      <S.Input ref={ref} error={error} name={name} {...rest} />
      {error && <ErrorMessage errors={form.errors} name={name!} as={S.InputError} />}
    </S.InputWrapper>
  );
};
