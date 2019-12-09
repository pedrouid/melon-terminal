import styled from 'styled-components';
import { Subtitle } from '~/components/Common/Styles/Styles';

export const Wrapper = styled.div`
  padding: ${props => props.theme.spaceUnits.s};

  @media (${props => props.theme.mediaQueries.l}) {
    flex: 1;
    border-right: 1px solid rgb(234, 229, 212);
    border-top: none;
    flex: 0 0 25%;
    order: 1;
  }
`;

export const Title = styled(Subtitle)`
  margin: 12px 0;
`;

export const Table = styled.table`
  background-color: ${props => props.theme.otherColors.white};
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

export const NoOpenOrders = styled.div``;
