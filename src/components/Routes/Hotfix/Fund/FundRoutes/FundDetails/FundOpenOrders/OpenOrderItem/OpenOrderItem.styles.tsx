import styled from 'styled-components';

export const BodyCell = styled.td`
  padding: ${props => props.theme.spaceUnits.s};
`;

export const BodyCellRightAlign = styled.td`
  padding: ${props => props.theme.spaceUnits.s};
  text-align: right;
`;

export const BodyRow = styled.tr`
  border-top: 1px solid ${props => props.theme.mainColors.border};
  border-bottom: 1px dashed rgb(234, 229, 212);
`;
