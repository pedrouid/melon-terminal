// TODO: Remove this again after the hotfix is no longer needed.

import gql from 'graphql-tag';
import * as R from 'ramda';
import { useOnChainQuery } from '~/hooks/useQuery';
import { Address } from '@melonproject/melonjs';
import BigNumber from 'bignumber.js';

export interface Fund {
  name: string;
  address: string;
  inception: string;
  sharePrice: string;
  totalSupply: string;
  version: string;
  status: string;
  shares: string;
}

export interface FundParticipationQueryResult {
  fund: {
    isShutDown: boolean;
    routes: {
      shares: {
        totalSupply: BigNumber;
      };
    };
  };
  account: {
    shares: {
      balanceOf: BigNumber;
    };
  };
}

export interface FundParticipationQueryVariables {
  fund?: Address;
}

const FundParticipationQuery = gql`
  query FundParticipationQuery($fund: Address!) {
    fund(address: $fund) {
      isShutDown
      routes {
        shares {
          totalSupply
        }
      }
    }

    account {
      shares(address: $fund) {
        balanceOf
      }
    }
  }
`;

export const useFundParticipationQuery = (fund?: Address) => {
  const result = useOnChainQuery<FundParticipationQueryResult, FundParticipationQueryVariables>(
    FundParticipationQuery,
    {
      variables: { fund },
      skip: !fund,
    }
  );

  const shutdown = R.pathOr(false, ['data', 'fund', 'isShutDown'], result);
  const supply = R.pathOr(new BigNumber(0), ['data', 'fund', 'routes', 'shares', 'totalSupply'], result);
  const balance = R.pathOr(new BigNumber(0), ['data', 'account', 'shares', 'balanceOf'], result);

  const data = !result.loading
    ? {
        shutdown,
        supply,
        balance,
      }
    : undefined;

  return [data, result] as [typeof data, typeof result];
};
