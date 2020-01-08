import styled, { css } from 'styled-components';
import { Bar, BarContent } from '../Bar/Bar';

export const DataBlockBar = styled(Bar)`
  position: relative;
  overflow: hidden;
  padding: ${props => props.theme.spaceUnits.l} 0px;
  &::before {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 200;
    width: ${props => props.theme.spaceUnits.xxl};
    height: 100%;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0));
  }
  &::after {
    content: '';
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 200;
    width: ${props => props.theme.spaceUnits.xxl};
    height: 100%;
    background: linear-gradient(to left, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0));
  }
`;

export const DataBlockBarContent = styled(BarContent)`
  width: 100%;
  max-width: 100%;
  flex-wrap: nowrap;
  overflow-y: scroll;
  margin-bottom: -${props => props.theme.spaceUnits.m};
  padding: 0px ${props => props.theme.spaceUnits.s};
  @media (${props => props.theme.mediaQueries.s}) {
    max-width: 100%;
  }
  @media (${props => props.theme.mediaQueries.m}) {
    max-width: 100%;
  }
  @media (${props => props.theme.mediaQueries.l}) {
    max-width: 100%;
  }
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;
