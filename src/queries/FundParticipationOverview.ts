// TODO: Remove this again after the hotfix is no longer needed.

import gql from 'graphql-tag';
import { format } from 'date-fns';
import { useTheGraphQuery } from '~/hooks/useQuery';
import { weiToString } from '~/utils/weiToString';
import { hexToString } from '~/utils/hexToString';
import { Address } from '@melonproject/melonjs';

interface FundFields {
  id: string;
  name: string;
  gav: string;
  sharePrice: string;
  totalSupply: string;
  createdAt: number;
  participation: {
    id: string;
  };
  version: {
    id: string;
    name: string;
  };
}

export interface Fund {
  name: string;
  address: string;
  inception: string;
  sharePrice: string;
  totalSupply: string;
  version: string;
  versionAddress: string;
  participationAddress: string;
}

export interface FundParticipationOverviewQueryResult {
  fundManager: {
    funds: FundFields[];
  };
  investor: {
    investments: {
      fund: FundFields;
    }[];
  };
}

export interface FundParticipationOverviewQueryVariables {
  investor?: Address;
}

const FundParticipationOverviewQuery = gql`
  fragment FundParticipationFragment on Fund {
    id
    name
    createdAt
    sharePrice
    totalSupply
    version {
      id
      name
    }
    participation {
      id
    }
  }

  query FundParticipationOverviewQuery($investor: ID!) {
    fundManager(id: $investor) {
      funds {
        ...FundParticipationFragment
      }
    }

    investor(id: $investor) {
      investments {
        fund {
          ...FundParticipationFragment
        }
      }
    }
  }
`;

export const useFundParticipationOverviewQuery = (investor?: Address) => {
  const result = useTheGraphQuery<FundParticipationOverviewQueryResult, FundParticipationOverviewQueryVariables>(
    FundParticipationOverviewQuery,
    {
      variables: { investor: investor && investor.toLowerCase() },
      skip: !investor,
    }
  );

  const investments = (result && result.data && result.data.investor && result.data.investor.investments) || [];
  const investmentsProcessed = investments.map(item => {
    const output: Fund = {
      address: item.fund.id,
      name: item.fund.name,
      inception: format(new Date(item.fund.createdAt * 1000), 'yyyy/MM/dd hh:mm a'),
      sharePrice: weiToString(item.fund.sharePrice, 4),
      totalSupply: weiToString(item.fund.totalSupply, 4),
      version: hexToString(item.fund.version.name),
      versionAddress: item.fund.version.id,
      participationAddress: item.fund.participation.id,
    };

    return output;
  });

  const managed = (result && result.data && result.data.fundManager && result.data.fundManager.funds) || [];
  const managedProcessed = managed.map(item => {
    const output: Fund = {
      address: item.id,
      name: item.name,
      inception: format(new Date(item.createdAt * 1000), 'yyyy/MM/dd hh:mm a'),
      sharePrice: weiToString(item.sharePrice, 4),
      totalSupply: weiToString(item.totalSupply, 4),
      version: hexToString(item.version.name),
      versionAddress: item.version.id,
      participationAddress: item.participation.id,
    };

    return output;
  });

  return [investmentsProcessed, managedProcessed, result] as [
    typeof investmentsProcessed,
    typeof managedProcessed,
    typeof result
  ];
};
