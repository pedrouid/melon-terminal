import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { useTheGraphQuery } from '~/hooks/useQuery';

export interface FundInvestmentHistory {
  id: string;
  amountInDenominationAsset: BigNumber;
  asset: {
    symbol: string;
  };
  owner: {
    id: string;
  };
  timestamp: number;
  action: string;
  shares: BigNumber;
  sharePrice: BigNumber;
  amount: BigNumber;
}

export interface FundDetailsQueryResult {
  fund: {
    investmentHistory: FundInvestmentHistory[];
  };
}

export interface FundInvestmentHistoryQueryVariables {
  id: string;
}

const FundInvestmentHistoryQuery = gql`
  query FundDetailsQuery($id: ID!) {
    fund(id: $id) {
      investmentHistory(orderBy: timestamp) {
        id
        asset {
          symbol
        }
        amountInDenominationAsset
        timestamp
        action
        owner {
          id
        }
        shares
        sharePrice
        amount
      }
    }
  }
`;

export const useFundInvestmentHistory = (id: string) => {
  const options = {
    variables: { id },
  };

  const result = useTheGraphQuery<FundDetailsQueryResult, FundInvestmentHistoryQueryVariables>(
    FundInvestmentHistoryQuery,
    options
  );

  return [result.data && result.data.fund && result.data.fund.investmentHistory, result] as [
    FundInvestmentHistory[] | undefined,
    typeof result
  ];
};
