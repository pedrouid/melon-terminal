import gql from 'graphql-tag';
import { useOnChainQuery } from '~/hooks/useQuery';
import { SetupProgressEnum } from '~/graphql/types';

export interface FundSetupState {
  shutdown?: boolean;
  progress?: SetupProgressEnum;
}

const FundSetupQuery = gql`
  query FundSetupQuery($address: Address!) {
    fund(address: $address) {
      progress
    }
  }
`;

export const useFundSetupStateQuery = (address?: string) => {
  const result = useOnChainQuery(FundSetupQuery, {
    skip: !address,
    variables: { address },
  });

  const output: FundSetupState = {
    shutdown: result.data?.fund?.isShutDown,
    progress: result.data?.fund?.progress,
  };

  return [output, result] as [typeof output, typeof result];
};
