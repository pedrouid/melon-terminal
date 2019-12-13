import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { useOnChainQuery } from '~/hooks/useQuery';

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

export interface FundDetailsQueryResult {
  account: AccountDetails;
  fund: FundDetails;
}

export interface FundDetailsQueryVariables {
  address: string;
}

const FundDetailsQuery = gql`
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

export const useFundDetailsQuery = (address: string) => {
  const options = {
    variables: { address },
  };

  const result = useOnChainQuery<FundDetailsQueryResult, FundDetailsQueryVariables>(FundDetailsQuery, options);
  return [result.data && result.data.fund, result.data && result.data.account, result] as [
    FundDetails | undefined,
    AccountDetails | undefined,
    typeof result
  ];
};
