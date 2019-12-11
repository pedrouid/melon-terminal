import styled from 'styled-components';

export const TransactionModal = styled.div`
  @media (${props => props.theme.mediaQueries.m}) {
    top: ${props => props.theme.spaceUnits.xxl};
    width: 700px;
    bottom: auto;
    left: auto;
    right: auto;
  }
  background: ${props => props.theme.mainColors.primary};
  position: absolute;
  border: none;
  overflow: auto;
  border-radius: 0px;
  outline: none;
  left: ${props => props.theme.spaceUnits.m};
  right: ${props => props.theme.spaceUnits.m};
  bottom: ${props => props.theme.spaceUnits.m};
  top: ${props => props.theme.spaceUnits.m};
  overflow-y: hidden;
  overflow-x: hidden;
`;

export const EthGasStation = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
  margin: 10px 0px 10px 0px;
`;

export const EthGasStationButton = styled.div`
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

export const NotificationError = styled.div`
  background-color: rgb(206, 88, 102);
  color: white;
  padding: 10px;
`;

export const TransactionModalTitle = styled.div`
  font-weight: 700;
  font-size: ${props => props.theme.fontSizes.l};
  background-color: ${props => props.theme.mainColors.secondary};
  margin-top: 0;
  padding: 12px ${props => props.theme.spaceUnits.m};
`;

export const TransactionModalContent = styled.div`
  margin: ${props => props.theme.spaceUnits.m};
`;

export const TransactionModalForm = styled.form`
  display: block;
  margin-top: 0;
`;

export const TransactionModalFeeForm = styled.div`
  margin: 0 0 ${props => props.theme.spaceUnits.m} 0;
`;

export const TransactionModalInput = styled.div`
  margin: 0 0 ${props => props.theme.spaceUnits.m} 0;
  position: relative;
`;

export const TransactionModalInputLabel = styled.span`
  position: absolute;
  top: ${props => props.theme.spaceUnits.s};
  margin-bottom: 0;
  color: ${props => props.theme.mainColors.primaryDark};
  display: block;
  margin: 0 0 ${props => props.theme.spaceUnits.xxs} ${props => props.theme.spaceUnits.xs};
  font-size: ${props => props.theme.fontSizes.s};
  line-height: ${props => props.theme.spaceUnits.m};
`;

export const TransactionModalInputField = styled.input`
  text-align: right;
  font-family: ${props => props.theme.fontFamilies.primary};
  font-size: ${props => props.theme.fontSizes.m};
  min-width: 100%;
  border: 1px solid ${props => props.theme.mainColors.border};
  padding: ${props => props.theme.spaceUnits.xs};
  line-height: 1;
  height: 38px;
  display: inline-block;
`;

export const TransactionModalMessage = styled.div`
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
