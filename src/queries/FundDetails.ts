import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { useOnChainQuery } from '~/hooks/useQuery';
import { useAccount } from '~/hooks/useAccount';

export interface FundDetails {
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

export interface AccountDetails {
  shares: {
    balanceOf: BigNumber;
  };
}

export interface FundDetailsQueryVariables {
  fund: string;
  account?: string | boolean;
}

const FundDetailsQuery = gql`
  query FundDetailsQuery($account: Address, $fund: Address!) {
    account(address: $account) @include(if: $account) {
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

export const useFundDetailsQuery = (fund: string) => {
  const account = useAccount();
  const options = {
    variables: { fund, account: account.address || false },
  };

  const result = useOnChainQuery<FundDetailsQueryVariables>(FundDetailsQuery, options);
  return [result.data && result.data.fund, result.data && result.data.account, result] as [
    FundDetails | undefined,
    AccountDetails | undefined,
    typeof result
  ];
};
