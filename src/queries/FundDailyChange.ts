import gql from 'graphql-tag';
import { useTheGraphQuery } from '~/hooks/useQuery';

import { calculateChangeFromSharePrice } from '~/utils/calculateChangeFromSharePrice';
import BigNumber from 'bignumber.js';

export interface FundDailyChangeQueryResult {
  fund: {
    calculationsHistory: {
      id: string;
      sharePrice: string;
      timestamp: string;
    }[];
  };
}

export interface FundDailyChangeQueryVariables {
  id: string;
}

const FundDailyChangeQuery = gql`
  query FundDailyChangeQuery($id: ID!) {
    fund(id: $id) {
      calculationsHistory(orderBy: timestamp, orderDirection: desc, first: 2) {
        id
        sharePrice
        timestamp
      }
    }
  }
`;

export const useFundDailyChange = (id: string) => {
  const options = {
    variables: { id },
  };

  const result = useTheGraphQuery<FundDailyChangeQueryResult, FundDailyChangeQueryVariables>(
    FundDailyChangeQuery,
    options
  );

  const fund = result?.data?.fund;

  const dailyChange = calculateChangeFromSharePrice(
    fund?.calculationsHistory[0]?.sharePrice,
    fund?.calculationsHistory[1]?.sharePrice
  );

  return [dailyChange, result] as [BigNumber | undefined, typeof result];
};
