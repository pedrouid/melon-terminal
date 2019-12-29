import gql from 'graphql-tag';
import { Address } from '@melonproject/melonjs';
import { useOnChainQuery } from '~/hooks/useQuery';
import { Maybe } from '~/types';

export interface AccountAddressQueryVariables {
  address: Address;
}

const AccountAddressQuery = gql`
  query AccountAddressQuery {
    account {
      address
    }
  }
`;

export const useAccountAddressQuery = () => {
  const result = useOnChainQuery<AccountAddressQueryVariables>(AccountAddressQuery);
  return [result.data && result.data.account && result.data.account.address, result] as [Maybe<Address>, typeof result];
};
