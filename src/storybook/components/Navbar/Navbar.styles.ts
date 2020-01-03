import styled from 'styled-components';

export const Navbar = styled.div`
  width: 100%;
  padding: ${props => props.theme.spaceUnits.m} 0px;
  border-bottom: ${props => props.theme.border.borderDefault};
  background-color: ${props => props.theme.mainColors.primary};
`;
