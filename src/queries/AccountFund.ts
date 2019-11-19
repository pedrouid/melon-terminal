import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';
import { Maybe } from '~/types';
import { Address } from '@melonproject/melonjs';

export interface AccountFund {
  fund: {
    address: Address;
    name: string;
    isShutDown: boolean;
    progress: string;
  };
}

export interface AccountFundQueryResult {
  account: AccountFund;
}

const AccountFundQuery = gql`
  query AccountFundQuery {
    account {
      fund {
        address
        name
        isShutDown
        progress
      }
    }
  }
`;

export const useAccountFundQuery = () => {
  const result = useOnChainQuery<AccountFundQueryResult>(AccountFundQuery);
  return [result.data && result.data.account, result] as [Maybe<AccountFund>, typeof result];
};
