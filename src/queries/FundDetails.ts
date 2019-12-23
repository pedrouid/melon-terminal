import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { useOnChainQuery } from '~/hooks/useQuery';
import { QueryHookOptions } from '@apollo/react-hooks';
import { Schema } from '~/graphql/types';

export interface FundDetails {
  address: string;
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
  address?: string;
}

const FundDetailsQuery = gql`
  query FundDetailsQuery($address: String!) {
    account {
      shares(address: $address) {
        balanceOf
      }
    }

    fund(address: $address) {
      address
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

export const useFundDetailsQuery = (options: QueryHookOptions<Schema, FundDetailsQueryVariables>) => {
  const result = useOnChainQuery<FundDetailsQueryVariables>(FundDetailsQuery, options);
  return [result.data && result.data.fund, result.data && result.data.account, result] as [
    FundDetails | undefined,
    AccountDetails | undefined,
    typeof result
  ];
};
