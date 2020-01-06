import styled, { css } from 'styled-components';

export const DataBlock = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  justify-content: space-between;
  padding: 0px;
  text-align: left;
  border-bottom: 1px dashed ${props => props.theme.mainColors.secondaryDark};
  padding-top: ${props => props.theme.spaceUnits.xs};
  @media (${props => props.theme.mediaQueries.m}) {
    display: block;
    width: 50%;
    padding: 0px ${props => props.theme.spaceUnits.m};
    border-bottom: none;
  }
`;

export const DataBlockLabel = styled.p`
  display: inline-block;
  margin-bottom: ${props => props.theme.spaceUnits.xs};
  margin-right: ${props => props.theme.spaceUnits.xs};
  color: ${props => props.theme.mainColors.secondaryDark};
  font-size: ${props => props.theme.fontSizes.m};
  white-space: nowrap;
  @media (${props => props.theme.mediaQueries.m}) {
    display: block;
    margin-right: 0px;
  }
`;

export const DataBlockContent = styled.p`
  display: inline-block;
  margin-bottom: 0px;
  color: ${props => props.theme.mainColors.primaryDark};
  font-size: ${props => props.theme.fontSizes.m};
  font-weight: ${props => props.theme.fontWeights.semiBold};
  white-space: nowrap;
  @media (${props => props.theme.mediaQueries.m}) {
    display: block;
  }
`;
