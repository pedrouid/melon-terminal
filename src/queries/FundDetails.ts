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
      sharePrice: BigNumber;
      grossAssetValue: BigNumber;
    };
    shares?: {
      totalSupply: BigNumber;
    };
    feeManager?: {
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

export interface FundDetailsQueryResult {
  fund: FundDetails;
}

export interface FundDetailsQueryVariables {
  address: string;
}

const FundDetailsQuery = gql`
  query FundDetailsQuery($address: String!) {
    fund(address: $address) {
      name
      manager
      creationTime
      isShutDown
      routes {
        accounting {
          sharePrice
          grossAssetValue
        }
        shares {
          totalSupply
        }
        feeManager {
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

export const useFundDetailsQuery = (address: string) => {
  const options = {
    variables: { address },
  };

  const result = useOnChainQuery<FundDetailsQueryResult, FundDetailsQueryVariables>(FundDetailsQuery, options);
  return [result.data && result.data.fund, result] as [FundDetails | undefined, typeof result];
};
