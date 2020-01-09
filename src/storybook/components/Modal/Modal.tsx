import styled from 'styled-components';

export const TransactionModal = styled.div`
  position: absolute;
  left: ${props => props.theme.spaceUnits.m};
  right: ${props => props.theme.spaceUnits.m};
  bottom: ${props => props.theme.spaceUnits.m};
  top: ${props => props.theme.spaceUnits.m};
  overflow: auto;
  overflow-y: hidden;
  overflow-x: hidden;
  border: none;
  border-radius: 0px;
  outline: none;
  background: ${props => props.theme.mainColors.primary};
  @media (${props => props.theme.mediaQueries.m}) {
    top: 50%;
    transform: translateY(-50%);
    width: 640px;
    bottom: auto;
    left: auto;
    right: auto;
  }
`;

export const TransactionModalTitle = styled.div`
  padding: 12px ${props => props.theme.spaceUnits.m};
  margin-top: 0;
  font-weight: 700;
  font-size: ${props => props.theme.fontSizes.l};
  border-bottom: 1px solid ${props => props.theme.mainColors.primaryDark};
`;

export const TransactionModalContent = styled.div`
  padding: ${props => props.theme.spaceUnits.l};
`;

export const TransactionModalForm = styled.form`
  display: block;
  margin-top: 0;
`;

export const TransactionModalFeeForm = styled.div`
  margin: 0 0 ${props => props.theme.spaceUnits.m} 0;
`;

export const TransactionModalActions = styled.div`
  margin-top: ${props => props.theme.spaceUnits.xl};
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  text-align: center;
`;

export const TransactionModalAction = styled.div`
  width: 50%;
  & + & {
    margin-left: ${props => props.theme.spaceUnits.m};
  }
`;

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
  padding-left: ${props => props.theme.spaceUnits.xs};
`;
