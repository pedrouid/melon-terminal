import styled from 'styled-components';

export const ScrollableTable = styled.div`
  overflow-y: auto;
  margin-top: ${props => props.theme.spaceUnits.m};
  margin-bottom: ${props => props.theme.spaceUnits.m};
  width: 100%;
`;

export const Table = styled.table`
  width: 100%;
  background-color: ${props => props.theme.otherColors.white};
`;

export const HeaderCell = styled.th`
  padding: ${props => props.theme.spaceUnits.m} ${props => props.theme.spaceUnits.s}
    ${props => props.theme.spaceUnits.s};
  text-align: left;
  cursor: pointer;
  font-weight: ${props => props.theme.fontWeights.semiBold};
`;

export const HeaderRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.mainColors.border};
`;

export const BodyCell = styled.td`
  padding: ${props => props.theme.spaceUnits.s};
`;

export const BodyRow = styled.tr`
  border-bottom: 1px double ${props => props.theme.mainColors.secondaryDarkAlpha};
  cursor: pointer;
  transition: ${props => props.theme.transition.defaultAll};
  &:hover {
    background-color: rgba(242, 242, 242, 0.6);
    transform: scale(1.005);
  }
`;

export const EmptyRow = styled.tr``;

export const EmptyCell = styled.td`
  text-align: center;
  padding: 50px;
`;
