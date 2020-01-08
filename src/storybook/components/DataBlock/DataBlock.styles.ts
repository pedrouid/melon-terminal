import styled, { css } from 'styled-components';

export const DataBlock = styled.div`
  display: block;
  position: relative;
  justify-content: space-between;
  padding: 0px;
  text-align: left;
  border-bottom: none;
  padding: 0px ${props => props.theme.spaceUnits.m};
`;

export const DataBlockLabel = styled.p`
  display: block;
  margin-bottom: ${props => props.theme.spaceUnits.xs};
  color: ${props => props.theme.mainColors.secondaryDark};
  font-size: ${props => props.theme.fontSizes.m};
  white-space: nowrap;
`;

export const DataBlockContent = styled.p`
  display: block;
  margin-bottom: 0px;
  color: ${props => props.theme.mainColors.primaryDark};
  font-size: ${props => props.theme.fontSizes.m};
  font-weight: ${props => props.theme.fontWeights.semiBold};
  white-space: nowrap;
`;
