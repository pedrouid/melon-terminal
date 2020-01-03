import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  background-color: ${props => props.theme.otherColors.white};
`;

export const HeaderCell = styled.th`
  padding: ${props => props.theme.spaceUnits.xxs} ${props => props.theme.spaceUnits.s};
  text-align: left;
  font-weight: bold;
`;

export const HeaderRow = styled.tr``;

export const EmptyRow = styled.tr``;

export const EmptyCell = styled.td`
  text-align: center;
  padding: 50px;
`;

export const Group = styled.div`
  margin-bottom: ${props => props.theme.spaceUnits.xxl};
`;
