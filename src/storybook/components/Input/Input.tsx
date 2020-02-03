import React from 'react';
import { useFormContext, ErrorMessage } from 'react-hook-form';
import * as S from './Input.styles';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  margin?: boolean;
}

export const Input: React.FC<InputProps> = ({ name, label, margin = true, type, ...rest }) => {
  const form = useFormContext();

  if (type === 'hidden') {
    return <S.Input name={name} type={type} {...rest} />;
  }

  const connected = !!(form && name);
  const ref = connected ? form.register : undefined;
  const errors = connected ? form.errors : undefined;
  const error = !!(errors && errors[name!]);

  return (
    <S.InputWrapper margin={margin}>
      {label && <S.InputLabel>{label}</S.InputLabel>}
      <S.Input ref={ref} error={error} name={name} type={type} {...rest} />
      {error && <ErrorMessage errors={form.errors} name={name!} as={<S.InputError />} />}
    </S.InputWrapper>
  );
};
