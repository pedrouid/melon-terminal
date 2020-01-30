import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface FundRegistryQueryResult {
  address: string;
}

export interface FundRegistryQueryVariables {
  address: string;
}

const FundRegistryQuery = gql`
  query FundRegistryQuery($address: String!) {
    fund(address: $address) {
      routes {
        registry {
          address
        }
      }
    }
  }
`;

export const useFundRegistryQuery = (address: string) => {
  const options = {
    variables: { address },
    skip: !address,
  };

  const result = useOnChainQuery<FundRegistryQueryVariables>(FundRegistryQuery, options);
  const output = result.data?.fund?.routes?.registry as FundRegistryQueryResult;

  return [output, result] as [typeof output, typeof result];
};
