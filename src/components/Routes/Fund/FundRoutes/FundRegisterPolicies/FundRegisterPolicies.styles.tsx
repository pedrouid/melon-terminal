import styled from 'styled-components';
import { PaddedBody } from '~/components/Common/Styles/Styles';

export const FundPoliciesBody = PaddedBody;

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

export const BodyRow = styled.tr`
  border-top: 1px solid ${props => props.theme.mainColors.border};
  border-bottom: 1px dashed rgb(234, 229, 212);
`;

export const NoRegisteredPolicies = styled.div`
  padding: ${props => props.theme.spaceUnits.s};
`;
