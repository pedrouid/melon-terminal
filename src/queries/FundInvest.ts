import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface FundInvestQueryVariables {
  address: string;
}

const FundHoldingsQuery = gql`
  query useFundInvestQuery($address: String!) {
    account {
      participation(address: $address) {
        address
        hasInvested
        investmentRequestState
        canCancelRequest
      }
      shares(address: $address) {
        address
        balanceOf
      }
    }
    fund(address: $address) {
      routes {
        accounting {
          address
          holdings {
            amount
            shareCostInAsset
            token {
              address
              symbol
              name
              price
              decimals
            }
          }
        }
      }
    }
  }
`;

export const useFundInvestQuery = (address: string) => {
  const options = {
    variables: { address },
  };

  const result = useOnChainQuery<FundInvestQueryVariables>(FundHoldingsQuery, options);
  return [result.data, result] as [typeof result.data, typeof result];
};
