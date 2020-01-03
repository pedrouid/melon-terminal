import styled from 'styled-components';

export const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
  background-color: ${props => props.theme.mainColors.primary};
  color: ${props => props.theme.mainColors.primaryDark};
  border: ${props => props.theme.border.borderDefault};
  &:before {
    content: '';
    position: absolute;
    right: ${props => props.theme.spaceUnits.s};
    top: ${props => props.theme.spaceUnits.m};
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid ${props => props.theme.border.borderColor};
    pointer-events: none;
  }
`;

export const DropdownSelect = styled.select`
  width: 100%;
  appearance: none;
  border-radius: 0;
  border: none;
  font-size: ${props => props.theme.fontSizes.m};
  background: transparent;
  padding: ${props => props.theme.spaceUnits.xs} ${props => props.theme.spaceUnits.xl}
    ${props => props.theme.spaceUnits.xs} ${props => props.theme.spaceUnits.s};
  line-height: 1.6;
  margin: 0;
  :focus {
    outline-color: ${props => props.theme.mainColors.secondaryDarkAlpha};
  }
  &::-ms-expand {
    display: none;
  }
  &:focus::-ms-value {
    background-color: transparent;
  }
`;
