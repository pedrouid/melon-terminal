import styled from 'styled-components';

export const DropdownWrapper = styled.div`
  margin-bottom: ${props => props.theme.spaceUnits.l};
  width: 100%;
`;

export const DropdownLabel = styled.span`
  display: inline-block;
  margin-bottom: ${props => props.theme.spaceUnits.xs};
  color: ${props => props.theme.mainColors.primaryDark};
`;

export const DropdownError = styled.span`
  display: inline-block;
  margin-top: ${props => props.theme.spaceUnits.xs};
  color: ${props => props.theme.statusColors.primaryLoss};
  font-size: ${props => props.theme.fontSizes.s};
`;

export const DropdownWithIcons = styled.div`
  display: flex;
  align-item: center;

  div {
    margin-right: 5px;
  }
`;
