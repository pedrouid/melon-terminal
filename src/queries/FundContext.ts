import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { useOnChainQuery } from '~/hooks/useQuery';
import { useAccount } from '~/hooks/useAccount';

export interface FundContext {
  name: string;
  manager: string;
  creationTime: Date;
  isShutDown: boolean;
  routes: {
    accounting?: {
      address: string;
      sharePrice: BigNumber;
      grossAssetValue: BigNumber;
    };
    shares?: {
      totalSupply: BigNumber;
    };
    feeManager?: {
      address: string;
      managementFeeAmount: BigNumber;
      performanceFeeAmount: BigNumber;
      managementFee?: {
        rate: BigNumber;
      };
      performanceFee?: {
        rate: BigNumber;
        period: number;
        canUpdate: boolean;
      };
    };
  };
}

export interface FundContextProcessed {
  name: string;
  manager: string;
  isShutDown: boolean;
}

export interface AccountDetails {
  shares: {
    balanceOf: BigNumber;
  };
}

export interface FundContextQueryVariables {
  fund: string;
  account?: string;
}

const FundContextQuery = gql`
  query FundDetailsQuery($account: Address!, $fund: String!) {
    account(address: $account) {
      shares(address: $fund) {
        balanceOf
      }
    }
    fund(address: $fund) {
      name
      manager
      creationTime
      isShutDown
      routes {
        accounting {
          address
        }
        shares {
          totalSupply
        }
        feeManager {
          address
          managementFeeAmount
          performanceFeeAmount
          managementFee {
            rate
          }
          performanceFee {
            rate
            period
            canUpdate
          }
        }
      }
    }
  }
`;

export const useFundContextQuery = (fund: string) => {
  const account = useAccount();
  const options = {
    skip: !account.address,
    variables: { fund, account: account.address },
  };

  const result = useOnChainQuery<FundContextQueryVariables>(FundContextQuery, options);
  const processed = {
    name: result.data?.fund?.name,
    manager: result.data?.fund?.manager,
    isShutDown: result.data?.fund?.isShutDown,
    balanceOf: result.data?.account?.shares?.balanceOf,
  };

  return [processed, result] as [FundContextProcessed | undefined, typeof result];
};
