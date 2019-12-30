import React from 'react';
import { ConnectionSelector } from '~/components/Common/ConnectionSelector/ConnectionSelector';
import { useAccount } from '~/hooks/useAccount';
import * as S from './RequiresAccount.styles';

// TODO: Finish this.

export interface RequiresAccountProps {
  loader?: React.ReactElement;
  // fallback?: React.ReactNode;
}

export const RequiresAccount: React.FC<RequiresAccountProps> = props => {
  const account = useAccount();

  if (account.loading) {
    return props.loader || null;
  }

  if (account && account.address) {
    return <>{props.children}</>;
  }

  return (
    <S.RequiresAccountBody>
      <h1>You have to be logged in to see this page.</h1>
      <ConnectionSelector />
    </S.RequiresAccountBody>
  );
};
