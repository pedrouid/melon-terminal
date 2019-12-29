import BigNumber from 'bignumber.js';
import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';

export interface AccountContext {
  fund?: string;
  eth?: BigNumber;
  weth?: BigNumber;
}

const AccountContextQuery = gql`
  query AccountContextQuery {
    account {
      eth: balance(token: ETH)
      weth: balance(token: WETH)
      fund {
        address
      }
    }
  }
`;

export const useAccountContextQuery = () => {
  const result = useOnChainQuery(AccountContextQuery);
  const account = result.data?.account;
  const output: AccountContext = {
    fund: account?.fund?.address,
    eth: (account as any)?.eth as BigNumber,
    weth: (account as any)?.weth as BigNumber,
  };

  return [output, result] as [AccountContext, typeof result];
};
