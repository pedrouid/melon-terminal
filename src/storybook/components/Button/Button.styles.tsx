import styled, { css } from 'styled-components';

export interface ButtonProps {
  kind?: 'secondary' | 'warning' | 'danger' | 'success';
  size?: 'large' | 'small';
  lenght?: 'stretch';
  disabled?: boolean;
  loading?: boolean;
}

const ButtonBase = css`
  display: flex;
  width: auto;
  height: ${props => props.theme.spaceUnits.xxl};
  padding: 0px ${props => props.theme.spaceUnits.m};
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: ${props => props.theme.border.borderRadius};
  font-family: inherit;
  font-size: ${props => props.theme.fontSizes.m};
  font-weight: ${props => props.theme.fontWeights.regular};
  white-space: nowrap;
  cursor: pointer;
  transition: ${props => props.theme.transition.defaultAll};
`;

export const Button = styled.button<ButtonProps>`
  ${ButtonBase}
  color: ${props => props.theme.mainColors.primary};
  background: ${props => props.theme.mainColors.primaryDark};
  :hover{
    opacity: 0.75;
  }
  :active{
    background: rgb(0,0,0);
  }
  ${props =>
    props.kind === 'secondary' &&
    css`
      color: ${props => props.theme.mainColors.primaryDark};
      background: ${props => props.theme.mainColors.primary};
      border: ${props => props.theme.border.borderDefault};
      :hover {
        background: ${props => props.theme.mainColors.secondary};
      }
    `}
  ${props =>
    props.kind === 'warning' &&
    css`
      background: ${props => props.theme.statusColors.warning};
    `}
  ${props =>
    props.kind === 'danger' &&
    css`
      background: ${props => props.theme.statusColors.primaryLoss};
    `}
  ${props =>
    props.kind === 'success' &&
    css`
      background: ${props => props.theme.statusColors.primaryProfit};
    `}
  ${props =>
    props.disabled &&
    css`
      color: ${props => props.theme.mainColors.secondaryDark};
      background: ${props => props.theme.mainColors.secondaryDarkAlpha};
      pointer-events: none;
    `}
  ${props =>
    props.size === 'large' &&
    css`
      height: 48px;
    `}
  ${props =>
    props.size === 'small' &&
    css`
      height: 32px;
    `}
    ${props =>
      props.lenght === 'stretch' &&
      css`
        width: 100%;
      `}
  & + & {
    margin-left: ${props => props.theme.spaceUnits.m};
  }
  svg{
    margin-left: ${props => props.theme.spaceUnits.xs};
  }
`;
