import styled from 'styled-components';

export const Menu = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  margin-bottom: ${props => props.theme.spaceUnits.xs};
  border-bottom: ${props => props.theme.border.borderSecondary};
`;

export interface MenuItemProps {
  active?: boolean;
}

export const MenuItem = styled.h3<MenuItemProps>`
  cursor: pointer;
  display: inline-block;
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: 0;
  margin-right: ${props => props.theme.spaceUnits.xl};
  border-bottom: none;
  position: relative;
`;
