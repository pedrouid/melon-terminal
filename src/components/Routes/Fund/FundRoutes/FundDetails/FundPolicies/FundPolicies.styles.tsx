import styled from 'styled-components';

export const Table = styled.table`
  border: 1px solid ${props => props.theme.mainColors.border};
  background-color: ${props => props.theme.otherColors.white};
  margin-top: ${props => props.theme.spaceUnits.m};
  margin-bottom: ${props => props.theme.spaceUnits.m};
`;

export const HeaderCell = styled.th`
  text-align: left;
  padding: ${props => props.theme.spaceUnits.s};
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
