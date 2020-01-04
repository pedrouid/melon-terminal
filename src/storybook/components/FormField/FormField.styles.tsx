import styled from 'styled-components';

export const FormField = styled.div`
  margin: 0 0 ${props => props.theme.spaceUnits.m} 0;
  position: relative;
`;

export const FormFieldLabel = styled.span`
  display: block;
  color: ${props => props.theme.mainColors.primaryDark};
  font-size: ${props => props.theme.fontSizes.s};
`;

export const FormFieldError = styled.div`
  color: red;
`;
