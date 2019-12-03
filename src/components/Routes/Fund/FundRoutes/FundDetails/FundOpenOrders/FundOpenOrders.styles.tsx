import styled from 'styled-components';
import { Subtitle } from '~/components/Common/Styles/Styles';

export const Wrapper = styled.div`
  @media (${props => props.theme.mediaQueries.l}) {
    flex: 1;
    border-right: 1px solid rgb(234, 229, 212);
    border-top: none;
    flex: 0 0 50%;
    order: 1;
  }
`;

export const Title = Subtitle;

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
