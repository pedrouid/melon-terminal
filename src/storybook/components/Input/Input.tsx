import styled, { css } from 'styled-components';

export interface InputBaseProps {
  disabled?: Boolean;
}

export const InputBase = css<InputBaseProps>`
  position: relative;
  width: 100%;
  padding: 0px ${props => props.theme.spaceUnits.m};
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
  ${props =>
      props.disabled &&
      css`
        background: ${props => props.theme.mainColors.secondary};
        border-color: ${props => props.theme.mainColors.secondaryDarkAlpha};
        pointer-events: none;
      `}
    :focus {
    outline-color: ${props => props.theme.mainColors.secondaryDarkAlpha};
  }
`;

export const Input = styled.input`
  ${InputBase};
  height: ${props => props.theme.spaceUnits.xl};
`;
