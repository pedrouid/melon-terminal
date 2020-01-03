import styled from 'styled-components';

export const InputFieldWrapper = styled.div`
  margin: 0 0 ${props => props.theme.spaceUnits.m} 0;
  position: relative;
`;

export const InputFieldLabel = styled.span`
  position: absolute;
  top: ${props => props.theme.spaceUnits.s};
  margin-bottom: 0;
  color: ${props => props.theme.mainColors.primaryDark};
  display: block;
  margin: 0 0 ${props => props.theme.spaceUnits.xxs} ${props => props.theme.spaceUnits.xs};
  font-size: ${props => props.theme.fontSizes.s};
  line-height: ${props => props.theme.spaceUnits.m};
`;

export const InputFieldError = styled.div`
  color: red;
`;
