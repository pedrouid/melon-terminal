import { useContext } from 'react';
import { Connection } from '~/components/Contexts/Connection';

export function useConnectionState() {
  return useContext(Connection);
}
