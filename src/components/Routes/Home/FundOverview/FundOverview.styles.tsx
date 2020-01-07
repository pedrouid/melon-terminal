import styled from 'styled-components';

export const ScrollableTable = styled.div`
  overflow-y: auto;
  border: 1px solid ${props => props.theme.mainColors.border};
  margin-top: ${props => props.theme.spaceUnits.m};
  margin-bottom: ${props => props.theme.spaceUnits.m};
  width: 100%;
`;

export const Table = styled.table`
  width: 100%;
  background-color: ${props => props.theme.otherColors.white};
`;

export const HeaderCell = styled.th`
  padding: ${props => props.theme.spaceUnits.s};
  text-align: left;
  cursor: pointer;
`;

export const HeaderRow = styled.tr``;

export const BodyCell = styled.td`
  padding: ${props => props.theme.spaceUnits.s};
`;

export const BodyRow = styled.tr`
  border-top: 1px solid ${props => props.theme.mainColors.border};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.mainColors.primary};
  }
`;

export const EmptyRow = styled.tr``;

export const EmptyCell = styled.td`
  text-align: center;
  padding: 50px;
`;
