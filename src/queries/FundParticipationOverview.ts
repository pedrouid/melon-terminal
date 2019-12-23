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
  createdAt: number;
  manager: string;
  participation: {
    id: string;
  };
  trading: {
    id: string;
  };
  version: {
    id: string;
    name: string;
  };
  accounting: {
    id: string;
    ownedAssets: {
      id: string;
    }[];
  };
}

interface InvestmentRequestFields {
  id: string;
  amount: string;
  shares: string;
  requestTimestamp: number;
  fund: FundFields;
  asset: {
    id: string;
    symbol: string;
  };
}

export interface InvestmentRequest extends Fund {
  requestAsset: string;
  requestShares: string;
  requestAmount: string;
  requestCreatedAt: string;
}

export interface Fund {
  name: string;
  address: string;
  inception: string;
  sharePrice: string;
  version: string;
  versionAddress: string;
  participationAddress: string;
  tradingAddress: string;
  accountingAddress: string;
  ownedAssets: string[];
  manager: string;
}

export interface FundParticipationOverviewQueryResult {
  fundManager: {
    funds: FundFields[];
  };
  investor: {
    investments: {
      fund: FundFields;
    }[];
    investmentRequests: InvestmentRequestFields[];
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
    version {
      id
      name
    }
    participation {
      id
    }
    trading {
      id
    }
    accounting {
      id
      ownedAssets {
        id
      }
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
      investmentRequests(where: { status: "PENDING" }) {
        id
        amount
        shares
        requestTimestamp
        fund {
          ...FundParticipationFragment
        }
        asset {
          id
          symbol
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
      version: hexToString(item.fund.version.name),
      versionAddress: item.fund.version.id,
      participationAddress: item.fund.participation.id,
      tradingAddress: item.fund.trading.id,
      accountingAddress: item.fund.accounting.id,
      ownedAssets: (item.fund.accounting.ownedAssets || []).map(asset => asset.id),
      manager: item.fund.manager,
    };

    return output;
  });

  const investmentRequests =
    (result && result.data && result.data.investor && result.data.investor.investmentRequests) || [];
  const investmentRequestsProcessed = investmentRequests.map(item => {
    const output: InvestmentRequest = {
      address: item.fund.id,
      name: item.fund.name,
      inception: format(new Date(item.fund.createdAt * 1000), 'yyyy/MM/dd hh:mm a'),
      requestCreatedAt: format(new Date(item.requestTimestamp * 1000), 'yyyy/MM/dd hh:mm a'),
      requestShares: weiToString(item.shares, 4),
      requestAmount: weiToString(item.amount, 4),
      requestAsset: item.asset.symbol,
      sharePrice: weiToString(item.fund.sharePrice, 4),
      version: hexToString(item.fund.version.name),
      versionAddress: item.fund.version.id,
      participationAddress: item.fund.participation.id,
      tradingAddress: item.fund.trading.id,
      accountingAddress: item.fund.accounting.id,
      ownedAssets: (item.fund.accounting.ownedAssets || []).map(asset => asset.id),
      manager: item.fund.manager,
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
      version: hexToString(item.version.name),
      versionAddress: item.version.id,
      participationAddress: item.participation.id,
      tradingAddress: item.trading.id,
      accountingAddress: item.accounting.id,
      ownedAssets: (item.accounting.ownedAssets || []).map(asset => asset.id),
      manager: item.manager,
    };

    return output;
  });

  return [investmentsProcessed, investmentRequestsProcessed, managedProcessed, result] as [
    typeof investmentsProcessed,
    typeof investmentRequestsProcessed,
    typeof managedProcessed,
    typeof result
  ];
};
