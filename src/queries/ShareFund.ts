import gql from 'graphql-tag';

export interface ShareFund {
  name: string;
  routes: {
    feeManager?: {
      performanceFee: {
        rate: number;
      };
      managementFee: {
        rate: number;
      };
    };
    participation?: {
      allowedAssets?: [
        {
          token?: {
            symbol?: string;
          };
        }
      ];
    };
    trading?: {
      exchanges?: [
        {
          exchange?: string;
        }
      ];
    };
  };
}

export interface ShareFundQueryVariables {
  fund: string;
}

export const ShareFundQuery = gql`
  query ShareFundQuery($fund: Address!) {
    fund(address: $fund) {
      name
      routes {
        feeManager {
          performanceFee {
            rate
          }
          managementFee {
            rate
          }
        }
        participation {
          allowedAssets {
            token {
              symbol
            }
          }
        }
        trading {
          exchanges {
            exchange
          }
        }
      }
    }
  }
`;
