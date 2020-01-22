import styled from 'styled-components';
import { Container, Row, Col } from 'react-awesome-styled-grid';

export const Grid = styled(Container)`
  width: 100%;
  margin: ${props => props.theme.spaceUnits.l} auto;
`;

export interface GridRowProps {
  noGap?: boolean;
}

export const GridRow = styled(Row)<GridRowProps>`
  ${props => !props.noGap && `margin-bottom: ${props.theme.spaceUnits.s}`};
`;

export const GridCol = styled(Col)`
  margin-bottom: ${props => props.theme.spaceUnits.xs};
`;
