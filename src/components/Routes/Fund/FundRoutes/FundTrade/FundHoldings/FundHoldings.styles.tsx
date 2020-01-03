import styled, { css } from 'styled-components';
import { Subtitle } from '~/components/Common/Styles/Styles';
import { BodyRowHover } from '~/components/Common/Table/Table.styles';

export const Wrapper = styled.div`
  position: relative;
  margin-bottom: ${props => props.theme.spaceUnits.xxl};
`;

export const Title = Subtitle;

export const HoldingSymbol = styled.span``;

export const HoldingName = styled.span`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.75rem;
  color: rgb(155, 155, 155);
`;

export interface BodyRowProps {
  active: boolean;
}

export const BodyRow = styled(BodyRowHover)<BodyRowProps>`
  ${props =>
    props.active &&
    `
    background-color: ${props.theme.mainColors.primary};
    font-weight: bold;
  `}
`;
