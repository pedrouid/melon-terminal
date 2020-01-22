import React from 'react';
import { useFormContext, ErrorMessage } from 'react-hook-form';
import * as S from './FormField.styles';

export interface FormFieldProps {
  name?: string;
  label?: string;
}

export const FormField: React.FC<FormFieldProps> = props => {
  const form = useFormContext();
  const connected = !!(form && props.name);
  const errors = connected && form?.errors;

  return (
    <S.FormField>
      {props.label && <S.FormFieldLabel>{props.label}</S.FormFieldLabel>}
      {props.children}
      {props.name && errors && <ErrorMessage errors={errors} name={props.name} as={S.FormFieldError} />}
    </S.FormField>
  );
};
