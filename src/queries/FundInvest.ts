import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { useOnChainQuery } from '~/hooks/useQuery';
import { useMemo } from 'react';

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

export interface FundInvestQueryVariables {
  address: string;
}

const FundHoldingsQuery = gql`
  query FundInvestQuery($address: String!) {
    account {
      participation(address: $address) {
        investmentRequestState
        canCancelRequest
      }
    }
  }
`;

export const useFundInvestQuery = (address: string) => {
  const options = {
    variables: { address },
  };

  const result = useOnChainQuery<FundInvestQueryVariables>(FundHoldingsQuery, options);
  const output = useMemo(() => {
    const participation = result.data?.account?.participation;

    return {
      investmentRequestState: participation?.investmentRequestState,
      canCancelRequest: participation?.canCancelRequest,
    };
  }, [result.data]);

  return [output, result] as [typeof output, typeof result];
};
