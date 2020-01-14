import gql from 'graphql-tag';
import { useTheGraphQuery } from '~/hooks/useQuery';
import { ExchangeDefinition, TokenDefinition } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';

export interface CallOnExchange {
  id: string;
  timestamp: number;
  exchange?: ExchangeDefinition;
  buyAsset?: TokenDefinition;
  sellAsset?: TokenDefinition;
}

export interface FundTradeHistoryQueryVariables {
  address?: string;
}

const FundTradeHistoryQuery = gql`
  query FundTradeHistoryQuery($address: ID!) {
    fund(id: $address) {
      trading {
        calls(orderBy: timestamp, orderDirection: "desc") {
          timestamp
          exchange {
            id
          }
          orderAddress2 {
            id
          }
          orderAddress3 {
            id
          }
          orderValue0
          orderValue1
          orderValue6
          methodSignature
        }
      }
    }
  }
`;

export const useFundTradeHistoryQuery = (address: string) => {
  const environment = useEnvironment()!;
  const result = useTheGraphQuery<any, FundTradeHistoryQueryVariables>(FundTradeHistoryQuery, {
    variables: { address: address?.toLowerCase() },
  });

  const calls = (result.data?.fund?.trading?.calls || []).map((item: any) => {
    return {
      id: item.id,
      timestamp: item.timestamp,
      exchange: environment.getExchange(item.exchange?.id),
      buyAsset: environment.getToken(item.orderAddress2?.id),
      sellAsset: environment.getToken(item.orderAddress3?.id),
    } as CallOnExchange;
  }) as CallOnExchange[];

  return [calls, result] as [typeof calls, typeof result];
};
