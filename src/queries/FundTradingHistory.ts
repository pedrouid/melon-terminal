import gql from 'graphql-tag';
import { useTheGraphQuery } from '~/hooks/useQuery';
import BigNumber from 'bignumber.js';

export interface Trade {
  id: string;
  timestamp: number;
  exchange: {
    id: string;
    name: string;
  };
  orderAddress2: {
    id: string;
    symbol: string;
    decimals: number;
  };
  orderAddress3: {
    id: string;
    symbol: string;
    decimals: number;
  };
  orderValue0: BigNumber;
  orderValue1: BigNumber;
  orderValue6: BigNumber;
  methodSignature: string;
}

export interface FundTradingHistoryQueryResult {
  fund?: {
    trading?: {
      calls?: Trade[];
    };
  };
}

export interface FundTradingHistoryQueryVariables {
  address: string;
}

const FundTradingHistoryQuery = gql`
  query FundTradingHistoryQuery($address: String!) {
    fund(id: $address) {
      trading {
        id
        calls(orderBy: timestamp, orderDirection: "desc") {
          id
          timestamp
          exchange {
            id
            name
          }
          orderAddress2 {
            id
            symbol
            decimals
          }
          orderAddress3 {
            id
            symbol
            decimals
          }
          orderValue0
          orderValue1
          orderValue6
          methodSignature
        }
      }
    }
  }
`;

export const useFundTradingHistoryQuery = (address: string) => {
  const options = {
    variables: { address },
  };

  const result = useTheGraphQuery<FundTradingHistoryQueryResult, FundTradingHistoryQueryVariables>(
    FundTradingHistoryQuery,
    options
  );

  const openMakeOrders = result.data?.fund?.trading?.calls ?? [];
  return [openMakeOrders, result] as [typeof openMakeOrders, typeof result];
};
