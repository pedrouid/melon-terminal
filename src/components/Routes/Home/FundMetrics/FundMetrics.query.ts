import gql from 'graphql-tag';
import { useTheGraphQuery } from '~/hooks/useQuery';

export interface FundMetricsResult {
  melonNetworkHistories?: {
    gav: number;
  };
  investorCounts?: {
    numberOfInvestors: number;
  };
  fundCounts?: {
    active: number;
    nonActive: number;
  };
}

const FundMetricsQuery = gql`
  query FundMetricsQuery {
    melonNetworkHistories(orderBy: timestamp, orderDirection: desc, first: 1) {
      gav
    }
    investorCounts(orderBy: timestamp, orderDirection: desc, first: 1) {
      numberOfInvestors
    }
    fundCounts(orderBy: timestamp, orderDirection: desc, first: 1) {
      active
      nonActive
    }
  }
`;

export const useFundMetricsQuery = () => {
  const result = useTheGraphQuery(FundMetricsQuery);
  return [result.data, result] as [typeof result.data, typeof result];
};
