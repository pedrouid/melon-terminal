import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { Address } from '@melonproject/melonjs';
import { useOnChainQuery } from '~/hooks/useQuery';
import { Maybe, NetworkEnum } from '~/types';

export interface ConnectionDetailsResult {
  network: NetworkEnum;
  account?: {
    address: Address;
    balanceEth: BigNumber;
    balanceWeth: BigNumber;
  };
}

const ConnectionDetailsQuery = gql`
  query ConnectionDetailsQuery {
    network
    account {
      address
      balanceEth: balance(token: ETH)
      balanceWeth: balance(token: WETH)
    }
  }
`;

export const useConnectionDetails = () => {
  const result = useOnChainQuery<ConnectionDetailsResult>(ConnectionDetailsQuery);
  return [result.data, result] as [Maybe<ConnectionDetailsResult>, typeof result];
};
