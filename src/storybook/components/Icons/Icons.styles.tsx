import styled, { css } from 'styled-components';

export interface IconProps {
  size: 'normal' | 'small';
}

export const IconsWrapper = styled.div<IconProps>`
  position: relative;
  display: block;

  cursor: pointer;

  ${props =>
    props.size === 'normal' &&
    css`
      height: 32px;
      width: 32px;
    `}
  ${props =>
    props.size === 'small' &&
    css`
      height: 16px;
      width: 16px;
    `}
`;

export const Img = styled.img<IconProps>`
  ${props =>
    props.size === 'normal' &&
    css`
      height: 32px;
      width: 32px;
    `}
  ${props =>
    props.size === 'small' &&
    css`
      height: 16px;
      width: 16px;
    `}
`;
