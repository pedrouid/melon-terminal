import gql from 'graphql-tag';
import { useTheGraphQuery } from '~/hooks/useQuery';

export interface FundMetrics {
  funds: {
    id: string;
  }[];
  investorCounts: {
    numberOfInvestors: number;
  }[];
  melonNetworkHistories: {
    gav: number;
  }[];
}

const FundMetricsQuery = gql`
  query FundMetricsQuery {
    melonNetworkHistories(orderBy: timestamp, orderDirection: desc, first: 1) {
      gav
    }
    investorCounts(orderBy: timestamp, first: 1000, orderDirection: desc) {
      numberOfInvestors
    }
    funds(first: 1000) {
      id
    }
  }
`;

export const useFundMetricsQuery = () => {
  const result = useTheGraphQuery(FundMetricsQuery);

  return [result.data, result] as [FundMetrics, typeof result];
};
