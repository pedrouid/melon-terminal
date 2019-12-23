import styled from 'styled-components';

export const EthGasStation = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
  margin: 10px 0px 10px 0px;
`;

export const EthGasStationButton = styled.button`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90px;
  border: 1px solid rgb(0, 0, 0, 0.5);
`;

export const EthGasStationButtonGwei = styled.span`
  font-weight: bold;
`;

export const EthGasStationButtonText = styled.span`
  font-size: 10px;
`;

export const TransactionModalForm = styled.form`
  display: block;
  margin-top: ${props => props.theme.spaceUnits.l};
`;

export const TransactionModalFeeForm = styled.div`
  margin: 0 0 ${props => props.theme.spaceUnits.m} 0;
`;


export const TransactionModalActions = styled.div`
  margin-top: ${props => props.theme.spaceUnits.m};
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const TransactionModalAction = styled.div`
  display: block;
  flex: 0 0 40%;
`;

export const TransactionModalConfirm = styled.button`
  background-color: transparent;
  cursor: pointer;
  text-transform: uppercase;
  line-height: 1;
  color: ${props => props.theme.otherColors.black};
  border: 1px solid ${props => props.theme.mainColors.secondaryDarkAlpha};
  background-color: ${props => props.theme.mainColors.secondaryDarkAlpha};
  padding: ${props => props.theme.spaceUnits.s} ${props => props.theme.spaceUnits.m};
  transition-duration: ${props => props.theme.transition.duration};
  min-width: 100%;
  font-family: ${props => props.theme.fontFamilies.primary};
  font-size: ${props => props.theme.fontSizes.m};

  &:hover,
  &:focus,
  &:active {
    background-color: ${props => props.theme.mainColors.secondaryDark};
  }
`;

export const TransactionModalCancel = styled.button`
  background-color: transparent;
  cursor: pointer;
  text-transform: uppercase;
  line-height: 1;
  border: 1px solid currentColor;
  padding: ${props => props.theme.spaceUnits.s} ${props => props.theme.spaceUnits.m};
  transition-duration: ${props => props.theme.transition.duration};
  min-width: 100%;
  font-family: ${props => props.theme.fontFamilies.primary};
  font-size: ${props => props.theme.fontSizes.m};

  &:hover,
  &:focus,
  &:active {
    border: 1px solid ${props => props.theme.otherColors.black};
    color: ${props => props.theme.otherColors.white};
    background-color: ${props => props.theme.otherColors.black};
  }
`;

export const TransactionModalMessages = styled.div`
  margin: ${props => props.theme.spaceUnits.m} 0 ${props => props.theme.spaceUnits.m} 0;
`;

export const TransactionModalMessagesTable = styled.table`
  margin: 0;
`;

export const TransactionModalMessagesTableBody = styled.tbody``;

export const TransactionModalMessagesTableRow = styled.tr`
  margin: 0;
`;

export const TransactionModalMessagesTableRowLabel = styled.td`
  margin: 0;
`;

export const TransactionModalMessagesTableRowQuantity = styled.td`
  padding-left: 8px;
`;
