// TODO: Remove this again after the hotfix is no longer needed.

import gql from 'graphql-tag';
import { format } from 'date-fns';
import { useTheGraphQuery } from '~/hooks/useQuery';
import { weiToString } from '~/utils/weiToString';
import { hexToString } from '~/utils/hexToString';
import { Address } from '@melonproject/melonjs';

export interface Fund {
  name: string;
  address: string;
  inception: string;
  sharePrice: string;
  shares: string;
  totalSupply: string;
  version: string;
  status: string;
}

export interface FundParticipationOverviewQueryResult {
  investor: {
    investments: {
      shares: string;
      fund: {
        id: string;
        name: string;
        gav: string;
        sharePrice: string;
        totalSupply: string;
        isShutdown: boolean;
        createdAt: number;
        version: {
          id: string;
          name: string;
        };
      };
    }[];
  };
}

export interface FundParticipationOverviewQueryVariables {
  investor?: Address;
}

const FundParticipationOverviewQuery = gql`
  query FundParticipationOverviewQuery($investor: ID!) {
    investor(id: $investor) {
      investments {
        shares
        fund {
          id
          name
          createdAt
          sharePrice
          totalSupply
          version {
            name
          }
        }
      }
    }
  }
`;

export const useFundParticipationOverviewQuery = (investor?: Address) => {
  const result = useTheGraphQuery<FundParticipationOverviewQueryResult, FundParticipationOverviewQueryVariables>(
    FundParticipationOverviewQuery,
    {
      variables: { investor },
      skip: !investor,
    }
  );

  const investments = (result && result.data && result.data.investor && result.data.investor.investments) || [];
  const processed = investments.map(item => {
    const output: Fund = {
      address: item.fund.id,
      name: item.fund.name,
      inception: format(new Date(item.fund.createdAt * 1000), 'yyyy/MM/dd hh:mm a'),
      sharePrice: weiToString(item.fund.sharePrice, 4),
      totalSupply: weiToString(item.fund.totalSupply, 4),
      version: hexToString(item.fund.version.name),
      status: item.fund.isShutdown ? 'Not active' : 'Active',
      shares: weiToString(item.shares, 4),
    };

    return output;
  });

  return [processed, result] as [typeof processed, typeof result];
};
