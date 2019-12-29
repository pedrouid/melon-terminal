import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { useOnChainQuery } from '~/hooks/useQuery';

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
  address: string;
}

const FundContextQuery = gql`
  query FundDetailsQuery($address: String!) {
    account {
      shares(address: $address) {
        balanceOf
      }
    }
    fund(address: $address) {
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

export const useFundContextQuery = (address: string) => {
  const options = {
    variables: { address },
  };

  const result = useOnChainQuery<FundContextQueryVariables>(FundContextQuery, options);
  const fund = result.data?.fund;
  const account = result.data?.account;

  const processed = {
    name: fund?.name,
    manager: fund?.manager,
    isShutDown: fund?.isShutDown,
    balanceOf: account?.shares?.balanceOf,
  };

  return [processed, result] as [FundContextProcessed | undefined, typeof result];
};
