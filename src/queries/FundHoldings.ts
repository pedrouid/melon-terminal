import gql from 'graphql-tag';
import * as R from 'ramda';
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

export interface FundHoldingsQueryResult {
  fund: {
    routes?: {
      accounting?: {
        holdings: FundHolding[];
      };
    };
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

  const result = useOnChainQuery<FundHoldingsQueryResult, FundHoldingsQueryVariables>(FundHoldingsQuery, options);
  const holdings = R.path<FundHolding[]>(['data', 'fund', 'routes', 'accounting', 'holdings'], result);
  return [holdings, result] as [typeof holdings, typeof result];
};
