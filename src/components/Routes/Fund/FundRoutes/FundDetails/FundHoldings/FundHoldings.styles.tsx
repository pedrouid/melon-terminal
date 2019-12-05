import styled from 'styled-components';
import { Subtitle } from '~/components/Common/Styles/Styles';

export const Wrapper = styled.div`
  @media (${props => props.theme.mediaQueries.m}) {
    border-right: 1px solid rgb(234, 229, 212);
    border-bottom: none;
  }
  background-color: rgb(255, 255, 255);
  flex: 1 0 25%;
  min-width: 250px;
`;

export const Title = Subtitle;

export const Table = styled.table`
  background-color: ${props => props.theme.otherColors.white};
  margin-top: ${props => props.theme.spaceUnits.m};
  margin-bottom: ${props => props.theme.spaceUnits.m};
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
`;

export const HeaderCell = styled.th`
  text-align: left;
  padding: ${props => props.theme.spaceUnits.s};
`;

export const HeaderCellRightAlign = styled.th`
  text-align: right;
  padding: ${props => props.theme.spaceUnits.s};
`;

export const HeaderRow = styled.tr`
  font-weight: bold;
  border-bottom: 1px solid rgb(234, 229, 212);
`;

export const BodyCell = styled.td`
  padding: ${props => props.theme.spaceUnits.s};
`;

export const BodyCellRightAlign = styled.td`
  padding: ${props => props.theme.spaceUnits.s};
  text-align: right;
`;

export const BodyRow = styled.tr`
  border-top: 1px solid ${props => props.theme.mainColors.border};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.mainColors.primary};
  }

  border-bottom: 1px dashed rgb(234, 229, 212);
`;

export const HoldingSymbol = styled.span``;

export const HoldingName = styled.span`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.75rem;
  color: rgb(155, 155, 155);
`;
