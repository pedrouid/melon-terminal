import React from 'react';
import { useFormContext } from 'react-hook-form';
import * as S from './FormField.styles';

export interface FormFieldProps {
  name?: string;
  label?: string;
}

export const FormField: React.FC<FormFieldProps> = (props) => {
  const form = useFormContext();
  const connected = !!(form && props.name);
  const error = connected && form?.errors[props.name!];

  return (
    <S.FormField>
      {props.label && <S.FormFieldLabel>{props.label}</S.FormFieldLabel>}
      {props.children}
      {error && <S.FormFieldError>{error.message}</S.FormFieldError>}
    </S.FormField>
  );
};
