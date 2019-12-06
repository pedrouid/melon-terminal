import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const InputSearchBar = styled.input`
  font-family: ${props => props.theme.fontFamilies.primary};
  font-size: ${props => props.theme.fontSizes.m};
  width: 100%;
  max-width: 250px;
  border: 1px solid ${props => props.theme.mainColors.border};
  padding: ${props => props.theme.spaceUnits.xs};
  line-height: 1;
  height: 38px;
  display: inline-block;
`;

export const Table = styled.table`
  border: 1px solid ${props => props.theme.mainColors.border};
  background-color: ${props => props.theme.otherColors.white};
  margin-top: ${props => props.theme.spaceUnits.m};
  margin-bottom: ${props => props.theme.spaceUnits.m};
  width: 100%;
  display: block;
  overflow-x: auto;
  white-space: nowrap;
`;

export const HeaderCell = styled.th`
  padding: ${props => props.theme.spaceUnits.s};
  text-align: left;
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
