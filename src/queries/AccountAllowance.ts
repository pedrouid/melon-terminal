import BigNumber from 'bignumber.js';
import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface AccountAllowance {
  allowance: BigNumber;
  balance: BigNumber;
}

const AccountAllowanceQuery = gql`
  query AccountBalancesQuery($token: String, $spender: String) {
    account {
      balance(token: $token)
      allowance(token: $token, spender: $spender)
    }
  }
`;

export const useAccountAllowanceQuery = (token?: string, spender?: string) => {
  const result = useOnChainQuery(AccountAllowanceQuery, {
    variables: {
      token,
      spender,
    },
    skip: !(token && spender),
  });

  return [result.data && result.data.account, result] as [AccountAllowance, typeof result];
};
