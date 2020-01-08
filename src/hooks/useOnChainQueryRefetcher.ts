import { useOnChainClient } from './useQuery';
import { useCallback } from 'react';
import { refetchQueries } from '~/utils/refetchQueries';

export function useOnChainQueryRefetcher() {
  const client = useOnChainClient();

  return useCallback(
    (names?: string[]) => {
      return refetchQueries(client, names);
    },
    [client]
  );
}
