import gql from 'graphql-tag';
import * as R from 'ramda';
import { useOnChainQuery } from '~/hooks/useQuery';
import { Address } from '@melonproject/melonjs';
import BigNumber from 'bignumber.js';

export interface FundParticipationQueryResult {
  fund: {
    isShutDown: boolean;
    routes: {
      shares: {
        totalSupply: BigNumber;
      };
      trading: {
        lockedAssets: boolean;
      };
    };
  };
  account: {
    shares: {
      balanceOf: BigNumber;
    };
    participation: {
      canCancelRequest: boolean;
    };
  };
}

export interface FundParticipationQueryVariables {
  fund?: Address;
}

const FundParticipationQuery = gql`
  query FundParticipationQuery($fund: Address!) {
    fund(address: $fund) {
      manager
      isShutDown
      routes {
        shares {
          totalSupply
        }
        trading {
          lockedAssets
        }
      }
    }
    account {
      shares(address: $fund) {
        balanceOf
      }
      participation(address: $fund) {
        canCancelRequest
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
      notifyOnNetworkStatusChange: true,
    }
  );

  const shutdown = R.pathOr(false, ['data', 'fund', 'isShutDown'], result);
  const manager = R.pathOr('', ['data', 'fund', 'manager'], result);
  const supply = R.pathOr(new BigNumber(0), ['data', 'fund', 'routes', 'shares', 'totalSupply'], result);
  const lockedAssets = R.pathOr([], ['data', 'fund', 'routes', 'trading', 'lockedAssets'], result);
  const balance = R.pathOr(new BigNumber(0), ['data', 'account', 'shares', 'balanceOf'], result);
  const cancelable = R.pathOr(false, ['data', 'account', 'participation', 'canCancelRequest'], result);

  const data = {
    manager,
    lockedAssets,
    shutdown,
    supply,
    balance,
    cancelable,
  };

  return [data, result] as [typeof data, typeof result];
};
