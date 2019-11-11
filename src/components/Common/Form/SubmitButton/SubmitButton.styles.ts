import styled from 'styled-components';

export const SubmitButtonWrapper = styled.button`
  display: block;
  min-width: 100%;
  cursor: pointer;
  text-transform: uppercase;
  line-height: 1;
  color: ${props => props.theme.otherColors.black};
  border: 1px solid ${props => props.theme.mainColors.secondaryDark};
  background-color: ${props => props.theme.mainColors.secondaryDarkAlpha};
  transition-duration: ${props => props.theme.transition.duration};
  font-size: ${props => props.theme.fontSizes.m};
  padding: ${props => props.theme.spaceUnits.s} ${props => props.theme.spaceUnits.m};
  font-family: ${props => props.theme.fontFamilies.primary};
  &:hover,
  &:focus,
  &:active {
    background-color: ${props => props.theme.mainColors.secondaryDark};
  }
`;
