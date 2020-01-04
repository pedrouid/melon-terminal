import styled, { css } from 'styled-components';

export interface BarProps {
  size?: 'full' | 'contained';
  justify?: 'between' | 'around' | 'end';
}

export const Bar = styled.div`
  width: 100%;
  padding: ${props => props.theme.spaceUnits.l} ${props => props.theme.spaceUnits.s};
  border-bottom: ${props => props.theme.border.borderDefault};
  background-color: ${props => props.theme.mainColors.primary};
`;

export const BarContent = styled.div<BarProps>`
  display: flex;
  justify-content: flex-start;
  align-content: center;
  flex-wrap: wrap;
  @media (${props => props.theme.mediaQueries.m}) {
    flex-wrap: nowrap;
  }
  ${props =>
    props.justify === 'between' &&
    css`
      justify-content: space-between;
    `}
  ${props =>
    props.justify === 'around' &&
    css`
      justify-content: space-around;
    `}
  ${props =>
    props.justify === 'end' &&
    css`
      justify-content: flex-end;
    `}
  ${props =>
     props.size === 'full' &&
     css`
       width: 100%;
    `}
  ${props =>
    props.size === 'contained' &&
    css`
      margin: 0px auto;
      @media (${props => props.theme.mediaQueries.s}) {
        max-width: ${props => props.theme.container.s};
      }
      @media (${props => props.theme.mediaQueries.m}) {
        max-width: ${props => props.theme.container.m};
      }
      @media (${props => props.theme.mediaQueries.l}) {
        max-width: ${props => props.theme.container.l};
      }
    `}
`;
