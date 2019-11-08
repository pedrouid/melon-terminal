import { useContext } from 'react';
import { Connection } from '~/components/Contexts/Connection';

export function useEnvironment() {
  const context = useContext(Connection);
  return context && context.environment;
}
