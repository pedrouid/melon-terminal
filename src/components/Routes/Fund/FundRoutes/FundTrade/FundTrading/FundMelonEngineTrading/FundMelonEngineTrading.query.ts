import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';
import BigNumber from 'bignumber.js';
import { useEnvironment } from '~/hooks/useEnvironment';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';

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
  const environment = useEnvironment()!;
  const result = useOnChainQuery<MelonEngineTradingQueryVariables>(MelonEngineTradingQuery, {
    skip: !address,
    variables: { address },
  });

  const weth = environment.getToken('WETH');
  const engine = result.data?.fund?.routes?.engine;
  const enginePrice = engine?.enginePrice;
  const liquidEther = engine?.liquidEther;

  return [fromTokenBaseUnit(enginePrice!, weth.decimals), fromTokenBaseUnit(liquidEther!, weth.decimals), result] as [
    BigNumber,
    BigNumber,
    typeof result
  ];
};
