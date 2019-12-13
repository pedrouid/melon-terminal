import gql from 'graphql-tag';
import * as R from 'ramda';
import BigNumber from 'bignumber.js';
import { useOnChainQuery } from '~/hooks/useQuery';
import { Address } from '@melonproject/melonjs';

export interface OpenMakeOrder {
  id: BigNumber;
  expiresAt: Date;
  orderIndex: BigNumber;
  buyAsset: Address;
  makerAsset: Address;
  takerAsset: Address;
  makerQuantity: BigNumber;
  takerQuantity: BigNumber;
  exchange: Address;
}

export interface FundOpenMakeOrdersQueryResult {
  fund: {
    routes?: {
      trading?: {
        openMakeOrders: OpenMakeOrder[];
      };
    };
  };
}

export interface FundOpenMakeOrdersQueryVariables {
  address: string;
}

const FundOpenMakeOrdersQuery = gql`
  query FundHoldingsOpenMakeOrdersQuery($address: String!) {
    fund(address: $address) {
      routes {
        trading {
          openMakeOrders {
            id
            expiresAt
            orderIndex
            buyAsset
            makerAsset
            takerAsset
            makerQuantity
            takerQuantity
            exchange
          }
        }
      }
    }
  }
`;

export const useFundOpenMakeOrdersQuery = (address: string) => {
  const options = {
    variables: { address },
  };

  const result = useOnChainQuery<FundOpenMakeOrdersQueryResult, FundOpenMakeOrdersQueryVariables>(
    FundOpenMakeOrdersQuery,
    options
  );
  const openMakeOrders = R.path<OpenMakeOrder[]>(['data', 'fund', 'routes', 'trading', 'openMakeOrders'], result);
  return [openMakeOrders, result] as [typeof openMakeOrders, typeof result];
};
