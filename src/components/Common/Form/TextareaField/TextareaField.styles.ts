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

export const Textarea = styled.textarea`
  text-align: right;
  font-family: ${props => props.theme.fontFamilies.primary};
  font-size: ${props => props.theme.fontSizes.m};
  min-width: 100%;
  border: 1px solid ${props => props.theme.mainColors.border};
  padding: ${props => props.theme.spaceUnits.xs};
  line-height: 1;
  display: inline-block;
`;

export const InputFieldError = styled.div`
  color: red;
`;
