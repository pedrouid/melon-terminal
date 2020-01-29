import styled, { css } from 'styled-components';

export interface IconProps {
  size?: 'normal' | 'small';
  pointer?: boolean;
}

export const IconsWrapper = styled.div<IconProps>`
  position: relative;
  display: block;

  ${props =>
    props.size &&
    props.size === 'normal' &&
    css`
      height: 32px;
      width: 32px;
    `}
  ${props =>
    props.size &&
    props.size === 'small' &&
    css`
      height: 16px;
      width: 16px;
    `}

    ${props =>
      props.pointer &&
      css`
        cursor: pointer;
      `}
`;

export const Img = styled.img<IconProps>`
  margin-left: auto;
  margin-right: auto;
  display: block;
  ${props =>
    props.size &&
    props.size === 'normal' &&
    css`
      height: 32px;
      width: 32px;
    `}
  ${props =>
    props.size &&
    props.size === 'small' &&
    css`
      height: 16px;
      width: 16px;
    `}
`;
