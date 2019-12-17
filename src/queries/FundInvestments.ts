import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { useTheGraphQuery } from '~/hooks/useQuery';

export interface FundInvestments {
  id: string;
  shares: BigNumber;
  owner: {
    id: string;
  };
}

export interface FundInvestmentsQueryResult {
  fund: {
    investments: FundInvestments[];
  };
}

export interface FundInvestmentsQueryVariables {
  id: string;
}

const FundInvestmentsQuery = gql`
  query FundDetailsQuery($id: ID!) {
    fund(id: $id) {
      name
      investments(orderBy: createdAt) {
        id
        shares
        owner {
          id
        }
      }
    }
  }
`;

export const useFundInvestments = (id: string) => {
  const options = {
    variables: { id },
  };

  const result = useTheGraphQuery<FundInvestmentsQueryResult, FundInvestmentsQueryVariables>(
    FundInvestmentsQuery,
    options
  );

  return [result.data && result.data.fund && result.data.fund.investments, result] as [
    FundInvestments[] | undefined,
    typeof result
  ];
};
