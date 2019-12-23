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

export const TransactionModalError = styled.div`
  background-color: rgb(206, 88, 102);
  color: white;
  padding: 10px;
  margin: ${props => props.theme.spaceUnits.l} 0;
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
