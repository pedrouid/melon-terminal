import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';
import { useMemo } from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { ExchangeDefinition } from '@melonproject/melonjs';

export interface FundTradingVariables {
  fund?: string;
}

const FundTrading = gql`
  query FundTrading($fund: String!) {
    fund(address: $fund) {
      name
      routes {
        trading {
          exchanges {
            exchange
          }
        }
      }
    }
  }
`;

export const useFundTrading = (fund?: string) => {
  const environment = useEnvironment()!;
  const result = useOnChainQuery<FundTradingVariables>(FundTrading, {
    skip: !fund,
    variables: { fund },
  });

  const exchanges = useMemo(() => {
    const addresses = (result.data?.fund?.routes?.trading?.exchanges || []).map(item => item.exchange!);
    return addresses.reduce<ExchangeDefinition[]>((carry, current) => {
      const exchange = environment.getExchange(current);
      return exchange ? [...carry, exchange] : carry;
    }, []);
  }, [result.data]);

  return [exchanges, result] as [typeof exchanges, typeof result];
};
