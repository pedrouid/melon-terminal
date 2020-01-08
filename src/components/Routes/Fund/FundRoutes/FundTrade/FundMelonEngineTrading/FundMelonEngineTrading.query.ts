import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';
import BigNumber from 'bignumber.js';

export interface MelonEngineTradingQueryVariables {
  address?: string;
}

const MelonEngineTradingQuery = gql`
  query MelonEngineTradingQuery($address: Address!) {
    fund(address: $address) {
      routes {
        engine {
          liquidEther
          enginePrice
        }
      }
    }
  }
`;

export const useMelonEngineTradingQuery = (address?: string) => {
  const result = useOnChainQuery<MelonEngineTradingQueryVariables>(MelonEngineTradingQuery, {
    skip: !address,
    variables: { address },
  });

  const engine = result.data?.fund?.routes?.engine;
  const enginePrice = engine?.enginePrice;
  const liquidEther = engine?.liquidEther;

  return [
    (enginePrice ?? new BigNumber(0)).dividedBy(new BigNumber(10).exponentiatedBy(18)),
    liquidEther ?? new BigNumber(0),
    result,
  ] as [BigNumber, BigNumber, typeof result];
};
