import styled from 'styled-components';
import { Bar, BarContent } from '../Bar/Bar';

export const DataBlockBar = styled(Bar)`
  position: relative;
  padding: ${props => props.theme.spaceUnits.l} 0px;
`;

export const DataBlockBarContent = styled(BarContent)`
  margin-bottom: -${props => props.theme.spaceUnits.m};
  padding: 0px ${props => props.theme.spaceUnits.s};
`;
