import styled from 'styled-components';

export const FundOrderbookTrading = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const FundOrderbook = styled.div`
  flex: 0.7 1;
  padding-left: ${props => props.theme.spaceUnits.l};
  border-left: 1px solid #c4c4c4;
`;

export const FundOrderbookForm = styled.div`
  flex: 0.5 1;
  padding-right: ${props => props.theme.spaceUnits.l};
`;
