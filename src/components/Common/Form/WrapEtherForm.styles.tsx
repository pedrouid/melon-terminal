import styled from 'styled-components';

export const WrapEtherForm = styled.form`
  display: block;
  margin-top: 0;
`;

export const WrapEtherFormBalances = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin: 0 ${props => props.theme.spaceUnits.xs} ${props => props.theme.spaceUnits.xs} 0;
  color: ${props => props.theme.otherColors.grey};
`;

export const WrapEtherFormBalance = styled.span`
  &:not(:first-child)::after {
    content: '';
    margin-right: ${props => props.theme.spaceUnits.xs};
    padding-right: ${props => props.theme.spaceUnits.xs};
    border-right: 1px solid;
  }
`;

export const WrapEtherInput = styled.div`
  margin: 0 0 ${props => props.theme.spaceUnits.m} 0;
  position: relative;
`;

export const WrapEtherInputLabel = styled.span`
  position: absolute;
  top: ${props => props.theme.spaceUnits.s};
  margin-bottom: 0;
  color: ${props => props.theme.mainColors.primaryDark};
  display: block;
  margin: 0 0 ${props => props.theme.spaceUnits.xxs} ${props => props.theme.spaceUnits.xs};
  font-size: ${props => props.theme.fontSizes.s};
  line-height: ${props => props.theme.spaceUnits.m};
`;

export const WrapEtherInputField = styled.input`
  text-align: right;
  font-family: ${props => props.theme.fontFamilies.primary};
  font-size: ${props => props.theme.fontSizes.m};
  min-width: 100%;
  border: 1px solid ${props => props.theme.mainColors.border};
  padding: ${props => props.theme.spaceUnits.xs};
  line-height: 1;
  height: 38px;
  display: inline-block;
`;

export const WrapEtherButton = styled.button`
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
