import styled from 'styled-components';

export const FundOrderbookTrading = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const FundOrderbook = styled.div`
  flex: 1 1;
  margin-right: ${props => props.theme.spaceUnits.l};
`;

export const FundOrderbookForm = styled.div`
  flex: 0.3 1;
`;
