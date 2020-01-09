import gql from 'graphql-tag';
import { format } from 'date-fns';
import BigNumber from 'bignumber.js';

import { useTheGraphQuery } from '~/hooks/useQuery';
import { weiToString } from '~/utils/weiToString';
import { hexToString } from '~/utils/hexToString';

export interface SharePriceChange {
  color: string;
  prefix: string;
  dailyReturn: number;
}

export interface SharePrice {
  sharePrice: string;
}

export interface Fund {
  id: string;
  name: string;
  gav: string;
  sharePrice: string;
  totalSupply: string;
  isShutdown: boolean;
  createdAt: number;
  investments: [
    {
      id: string;
    }
  ];
  version: {
    id: string;
    name: string;
  };
  accounting: {
    id: string;
    denominationAsset: {
      id: string;
      symbol: string;
    };
  };
  calculationsHistory: {
    id: string;
    sharePrice: string;
    timestamp: string;
  }[];
}

export interface FundProcessed {
  id: string;
  name: string;
  address: string;
  inception: string;
  aumEth: string;
  sharePrice: string;
  change: SharePriceChange;
  shares: string;
  denomination: string;
  investments: number;
  version: string;
  status: string;
}

export interface FundOverviewQueryResult {
  funds: Fund[];
}

export interface FundOverviewQueryVariables {
  orderBy: string;
}

const FundOverviewQuery = gql`
  query FundOverviewQuery {
    funds(
      first: 1000
      where: { id_not: "0x1e3ef9a8fe3cf5b3440b0df8347f1888484b8dc2" }
      orderBy: "sharePrice"
      orderDirection: "desc"
    ) {
      id
      name
      gav
      sharePrice
      totalSupply
      isShutdown
      createdAt
      investments {
        id
      }
      version {
        id
        name
      }
      accounting {
        id
        denominationAsset {
          id
          symbol
        }
      }
      calculationsHistory(orderBy: timestamp, orderDirection: desc, first: 2) {
        id
        sharePrice
        timestamp
      }
    }
  }
`;

function calculateChangeFromSharePrice(current?: SharePrice, previous?: SharePrice): SharePriceChange {
  if (current && previous) {
    const bnCurrent = new BigNumber(current.sharePrice);
    const bnPrevious = new BigNumber(previous.sharePrice);

    const returnSinceLastPriceUpdate = bnCurrent.dividedBy(bnPrevious).toNumber() - 1;
    const dailyReturn = 100 * returnSinceLastPriceUpdate;

    const color = dailyReturn > 0 ? 'green' : dailyReturn < 0 ? 'red' : 'grey';
    const prefix = dailyReturn > 0 ? '+' : '';

    return { color, prefix, dailyReturn };
  }

  return { color: 'primary', prefix: '', dailyReturn: 0 };
}

export const useFundOverviewQuery = () => {
  const result = useTheGraphQuery<FundOverviewQueryResult, FundOverviewQueryVariables>(FundOverviewQuery);

  const funds = (result && result.data && result.data.funds) || [];

  const processed = funds.map(item => ({
    id: item.id,
    name: item.name,
    address: item.id.substr(0, 8),
    inception: format(new Date(item.createdAt * 1000), 'yyyy/MM/dd hh:mm a'),
    aumEth: weiToString(item.gav, 4),
    sharePrice: weiToString(item.sharePrice, 4),
    change: calculateChangeFromSharePrice(item.calculationsHistory[0] || 0, item.calculationsHistory[1] || 0),
    shares: weiToString(item.totalSupply, 4),
    denomination: item.accounting.denominationAsset.symbol,
    investments: item.investments.length,
    version: hexToString(item.version.name),
    status: item.isShutdown ? 'Not active' : 'Active',
  }));

  return [processed, result] as [FundProcessed[], typeof result];
};
