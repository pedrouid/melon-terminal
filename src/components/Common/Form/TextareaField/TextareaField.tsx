import * as S from './TextareaField.styles';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { TextArea } from '~/storybook/components/Textarea/Textarea';
import { NotificationBar } from '~/storybook/components/NotificationBar/NotificationBar';
import { GridRow, GridCol } from '~/storybook/components/Grid/Grid';

export interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  rows?: number;
  cols?: number;
  placeholder?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({ name, rows, cols, placeholder, ...rest }) => {
  const form = useFormContext();
  const error = form.errors[name];

  return (
    <>
      <GridRow>
        <GridCol>
          <TextArea
            {...rest}
            name={name}
            ref={form.register}
            cols={cols || 30}
            rows={rows || 5}
            placeholder={placeholder}
          />
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol>{error && <NotificationBar kind="error">{error.message}</NotificationBar>}</GridCol>
      </GridRow>
    </>
  );
};
