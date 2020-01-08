import styled from 'styled-components';

export const FormField = styled.div`
  position: relative;
  display: block;
  margin: ${props => props.theme.spaceUnits.m} 0 ${props => props.theme.spaceUnits.l};
`;

export const FormFieldLabel = styled.span`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-bottom: ${props => props.theme.spaceUnits.xxs};
  margin-bottom: ${props => props.theme.spaceUnits.xs};
  color: ${props => props.theme.mainColors.primaryDark};
  font-size: ${props => props.theme.fontSizes.m};
`;

export const FormFieldError = styled.div`
  padding: ${props => props.theme.spaceUnits.xs} ${props => props.theme.spaceUnits.xxs} 0px;
  color: ${props => props.theme.statusColors.primaryLoss};
  font-size: ${props => props.theme.fontSizes.s};
`;
