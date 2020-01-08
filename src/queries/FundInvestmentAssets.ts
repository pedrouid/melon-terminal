import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';
import { useAccount } from '~/hooks/useAccount';

export interface FundInvestmentAssetsQueryVariables {
  fund: string;
}

const FundInvestmentAssetsQuery = gql`
  query useFundInvestmentAssetsQuery($fund: Address!) {
    fund(address: $fund) {
      routes {
        participation {
          address
          allowedAssets {
            token {
              address
              symbol
              name
              decimals
            }
          }
        }
      }
    }
  }
`;

export const useFundInvestmentAssetsQuery = (fund: string) => {
  const account = useAccount();
  const options = {
    variables: { fund },
  };

  const result = useOnChainQuery<FundInvestmentAssetsQueryVariables>(FundInvestmentAssetsQuery, options);
  return [result.data, result] as [typeof result.data, typeof result];
};
