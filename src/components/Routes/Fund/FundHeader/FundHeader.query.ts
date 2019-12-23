import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { useOnChainQuery, OnChainQueryHookOptions } from '~/hooks/useQuery';
import { useMemo } from 'react';

export interface FundHeader {
  address: string;
  name: string;
  manager: string;
  creationTime: Date;
  routes: {
    accounting?: {
      sharePrice: BigNumber;
      grossAssetValue: BigNumber;
    };
    shares?: {
      totalSupply: BigNumber;
    };
    feeManager?: {
      managementFeeAmount: BigNumber;
      performanceFeeAmount: BigNumber;
      managementFee?: {
        rate: BigNumber;
      };
      performanceFee?: {
        rate: BigNumber;
        period: number;
      };
    };
  };
}

export interface AccountDetails {
  shares: {
    balanceOf: BigNumber;
  };
}

export interface FundHeaderQueryVariables {
  address?: string;
}

const FundHeaderQuery = gql`
  query FundHeaderQuery($address: String!) {
    account {
      shares(address: $address) {
        balanceOf
      }
    }

    fund(address: $address) {
      address
      creationTime
      isShutDown
      routes {
        shares {
          totalSupply
        }
        feeManager {
          managementFeeAmount
          performanceFeeAmount
          managementFee {
            rate
          }
          performanceFee {
            rate
            period
          }
        }
      }
    }
  }
`;

export const useFundHeaderQuery = (options: OnChainQueryHookOptions<FundHeaderQueryVariables>) => {
  const result = useOnChainQuery<FundHeaderQueryVariables>(FundHeaderQuery, options);
  const output = useMemo(() => {
    const ownedShares = result.data?.account?.shares?.balanceOf;
    const fund = result.data?.fund;
    const fundAddress = fund?.address;
    const fundCreationTime = fund?.creationTime;

    return {
      ownedShares,
      fundAddress,
    };
  }, [result.data]);

  return [output, result] as [typeof output, typeof result];
};
