import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';

const PriceFeedUpdateQuery = gql`
  query PriceFeedUpdateQuery {
    prices {
      lastUpdate
    }
  }
`;

export const usePriceFeedUpdateQuery = () => {
  const result = useOnChainQuery(PriceFeedUpdateQuery);
  const timestamp = result.data?.prices?.lastUpdate;
  return [timestamp, result] as [typeof timestamp, typeof result];
};
