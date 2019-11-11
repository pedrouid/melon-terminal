import * as S from './InputField.styles';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  type: 'text' | 'number';
}

export const InputField: React.FC<InputFieldProps> = ({ name, label, type, ...rest }) => {
  const form = useFormContext();
  const error = form.errors[name];

  return (
    <S.InputFieldWrapper>
      {label && <S.InputFieldLabel>{label}</S.InputFieldLabel>}
      <S.InputFieldInput {...rest} type={type} name={name} ref={form.register} />
      {error && <S.InputFieldError>{error.message}</S.InputFieldError>}
    </S.InputFieldWrapper>
  );
};
