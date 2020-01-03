import styled from 'styled-components';

export const DataBlock = styled.div`
  position: relative;
  width: 100%;
  padding: 0px ${props => props.theme.spaceUnits.s};
  text-align: center;
  font-weight: ${props => props.theme.fontWeights.semiBold};
`;
export const DataBlockLabel = styled.p`
  margin-bottom: ${props => props.theme.spaceUnits.m};
  color: ${props => props.theme.mainColors.secondaryDark};
  font-size: ${props => props.theme.fontSizes.m};
`;

export const DataBlockContent = styled.p`
  margin-bottom: 0px;
  color: ${props => props.theme.mainColors.primaryDark};
  font-size: ${props => props.theme.fontSizes.xl};
`;
