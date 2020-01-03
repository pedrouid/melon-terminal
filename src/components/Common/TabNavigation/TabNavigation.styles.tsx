import styled, { css } from 'styled-components';

export const Menu = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  margin-bottom: ${props => props.theme.spaceUnits.m};

  &::after {
    content: ' ';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    border-top: 1px solid rgba(34, 36, 38, 0.15);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

export interface MenuItemProps {
  active?: boolean;
}

export const MenuItem = styled.span<MenuItemProps>`
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: bold;
  position: relative;
`;
