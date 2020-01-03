import { PaddedBody } from '~/components/Common/Styles/Styles';
import styled from 'styled-components';

export const FundTradeBody = PaddedBody;

export const FundTradeTop = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const FundTradeBottom = styled.div``;

export const FundHoldings = styled.div`
  flex: 0.3 1;
  margin-right: ${props => props.theme.spaceUnits.l};
`;

export const FundTrading = styled.div`
  flex: 1 1;
`;
