import styled from 'styled-components';

export const CancelButtonWrapper = styled.button`
  background-color: transparent;
  cursor: pointer;
  text-transform: uppercase;
  line-height: 1;
  border: 1px solid currentColor;
  padding: ${props => props.theme.spaceUnits.s} ${props => props.theme.spaceUnits.m};
  transition-duration: ${props => props.theme.transition.duration};
  min-width: 100%;
  font-family: ${props => props.theme.fontFamilies.primary};
  font-size: ${props => props.theme.fontSizes.m};
  &:hover,
  &:focus,
  &:active {
    border: 1px solid ${props => props.theme.otherColors.black};
    color: ${props => props.theme.otherColors.white};
    background-color: ${props => props.theme.otherColors.black};
  }
`;
