import * as S from './TextareaField.styles';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  rows?: number;
  cols?: number;
  placeholder?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({ name, label, rows, cols, placeholder, ...rest }) => {
  const form = useFormContext();
  const error = form.errors[name];

  return (
    <S.InputFieldWrapper>
      {label && <S.InputFieldLabel>{label}</S.InputFieldLabel>}
      <S.Textarea
        {...rest}
        name={name}
        ref={form.register}
        cols={cols || 30}
        rows={rows || 5}
        placeholder={placeholder}
      />
      {error && <S.InputFieldError>{error.message}</S.InputFieldError>}
    </S.InputFieldWrapper>
  );
};
