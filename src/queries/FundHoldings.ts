import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface FundHolding {
  amount: BigNumber;
  token: {
    address: string;
    symbol: string;
    decimals: number;
    name: string;
    price: BigNumber;
  };
}

export interface FundHoldingsQueryVariables {
  address: string;
}

const FundHoldingsQuery = gql`
  query FundHoldingsQuery($address: String!) {
    fund(address: $address) {
      routes {
        accounting {
          holdings {
            amount
            token {
              address
              symbol
              decimals
              name
              price
            }
          }
        }
      }
    }
  }
`;

export const useFundHoldingsQuery = (address: string) => {
  const options = {
    variables: { address },
  };

  const result = useOnChainQuery<FundHoldingsQueryVariables>(FundHoldingsQuery, options);
  const holdings = result.data?.fund?.routes?.accounting?.holdings ?? [];
  return [holdings, result] as [typeof holdings, typeof result];
};
