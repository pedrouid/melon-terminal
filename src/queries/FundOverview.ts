import gql from 'graphql-tag';
import { useTheGraphQuery } from '~/hooks/useQuery';

export interface Fund {
  id: string;
  name: string;
  gav: string;
  sharePrice: string;
  totalSupply: string;
  isShutdown: boolean;
  createdAt: number;
  version: {
    name: string;
  };
}

export interface FundOverviewQueryResult {
  funds: Fund[];
}

export interface FundOverviewQueryVariables {
  address: string;
}

const FundOverviewQuery = gql`
  query FundOverviewQuery {
    funds(orderBy: name, first: 200) {
      id
      name
      gav
      sharePrice
      totalSupply
      isShutdown
      createdAt
      version {
        name
      }
    }
  }
`;

export const useFundOverviewQuery = () => {
  const result = useTheGraphQuery<FundOverviewQueryResult, FundOverviewQueryVariables>(FundOverviewQuery);
  return [result && result.data && result.data.funds, result] as [Fund[], typeof result];
};
