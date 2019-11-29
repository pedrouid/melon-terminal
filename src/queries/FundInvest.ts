import gql from 'graphql-tag';
import * as R from 'ramda';
import BigNumber from 'bignumber.js';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface AccountParticipation {
  address: string;
  hasInvested: boolean;
  investmentRequestState: string;
  canCancelRequest: boolean;
}

export interface AccountShares {
  address: string;
  balanceOf: BigNumber;
}

export interface FundInvestHolding {
  amount: BigNumber;
  shareCostInAsset: BigNumber;
  token: {
    address: string;
    symbol: string;
    name: string;
    price: BigNumber;
    decimals: number;
  };
}

export interface FundInvestRoutes {
  accounting: {
    address: string;
    holdings: FundInvestHolding[];
  };
}

export interface FundInvestQueryResult {
  account: {
    participation: AccountParticipation;
    shares: AccountShares;
  };
  fund: {
    routes: FundInvestRoutes;
  };
}

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

  const result = useOnChainQuery<FundInvestQueryResult, FundInvestQueryVariables>(FundHoldingsQuery, options);
  const routes = R.path<FundInvestQueryResult>(['data'], result);
  return [routes, result] as [typeof routes, typeof result];
};
