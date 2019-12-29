import React, { createContext, useMemo } from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccountContextQuery, AccountContext } from './Account.query';

export interface AccountContextValue extends AccountContext {
  loading: boolean;
  address?: string;
}

export const Account = createContext<AccountContextValue>({
  loading: true,
});

export const AccountContextProvider: React.FC = props => {
  const environment = useEnvironment();
  const [account, query] = useAccountContextQuery();
  const output = useMemo(() => ({ ...account, address: environment?.account, loading: query.loading }), [
    account,
    query.loading,
    environment?.account,
  ]);

  return <Account.Provider value={output}>{props.children}</Account.Provider>;
};
