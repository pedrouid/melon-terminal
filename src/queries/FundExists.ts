import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface FundExistsQueryVariables {
  address: string;
}

const FundExistsQuery = gql`
  query FundExistsQuery($address: String!) {
    fund(address: $address) {
      address
    }
  }
`;

export const useFundExistsQuery = (address: string) => {
  const options = {
    variables: { address },
  };

  const result = useOnChainQuery<FundExistsQueryVariables>(FundExistsQuery, options);
  return [result.data && !!result.data.fund, result] as [boolean | undefined, typeof result];
};
