import styled from 'styled-components';

export const DataBlockBar = styled.div`
  width: 100%;
  padding: ${props => props.theme.spaceUnits.l} 0px;
  border-bottom: ${props => props.theme.border.borderDefault};
  background-color: ${props => props.theme.mainColors.primary};
`;
export const DataBlockBarContent = styled.div`
  display: flex;
  justify-content: space-between;
`;
