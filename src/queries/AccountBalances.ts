import BigNumber from 'bignumber.js';
import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface AccountBalances {
  eth: BigNumber;
  weth: BigNumber;
}

const AccountBalancesQuery = gql`
  query AccountBalancesQuery {
    account {
      eth: balance(token: ETH)
      weth: balance(token: WETH)
    }
  }
`;

export const useAccountBalancesQuery = () => {
  const result = useOnChainQuery(AccountBalancesQuery);
  const output: AccountBalances = {
    weth: (result.data?.account as any)?.weth,
    eth: (result.data?.account as any)?.eth,
  };

  return [output, result] as [typeof output, typeof result];
};
