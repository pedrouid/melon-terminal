import styled, { css } from 'styled-components';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { NotificationBar } from '~/storybook/components/NotificationBar/NotificationBar';
import { GridRow, GridCol } from '~/storybook/components/Grid/Grid';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  rows?: number;
  cols?: number;
  placeholder?: string;
}

const TextAreaStyle = styled.textarea`
  position: relative;
  width: 100%;
  min-height: calc(${props => props.theme.spaceUnits.xl} * 4);
  padding: ${props => props.theme.spaceUnits.m};
  border: 1px solid ${props => props.theme.mainColors.secondaryDarkAlpha};
  border-radius: 0;
  font-family: inherit;
  font-size: ${props => props.theme.fontSizes.m};
  background: ${props => props.theme.mainColors.primary};
  box-shadow: inset 1px 4px 4px rgba(200, 200, 200, 0.25);
  ::placeholder {
    color: ${props => props.theme.mainColors.secondaryDarkAlpha};
    font-size: ${props => props.theme.fontSizes.s};
  }
  :focus {
    outline-color: ${props => props.theme.mainColors.secondaryDarkAlpha};
  }
  ${props =>
    props.disabled &&
    css`
      background: ${props => props.theme.mainColors.secondary};
      border-color: ${props => props.theme.mainColors.secondaryDarkAlpha};
      pointer-events: none;
    `}
`;

export const Textarea: React.FC<TextareaProps> = ({ name, rows, cols, placeholder, ...rest }) => {
  const form = useFormContext();
  const error = form.errors[name];

  return (
    <>
      <GridRow>
        <GridCol>
          <TextAreaStyle
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
