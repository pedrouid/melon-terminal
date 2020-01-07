import React from 'react';
import { Link } from '~/components/Common/Link/Link';
import { useLocation } from 'react-router';
import { useAccount } from '~/hooks/useAccount';
import { useEnvironment } from '~/hooks/useEnvironment';

import {
  Header as HeaderContainer,
  LogoContainer,
  Account,
  AccountAddress,
  AccountBalance,
  AccountName,
  AccountInfo,
  AccountNetwork,
  AccountInfoItem,
} from '~/storybook/components/Header/Header';
import { SkeletonHead } from '~/storybook/components/Skeleton/Skeleton';
import { Logo } from '~/storybook/components/Logo/Logo';

export const Header: React.FC = () => {
  const environment = useEnvironment();
  const location = useLocation();
  const account = useAccount();

  return (
    <SkeletonHead>
      <HeaderContainer>
        <LogoContainer>
          <Link to="/">
            <Logo name="with-bottom-text" size="small" />
          </Link>
        </LogoContainer>
        <Account>
          <AccountName>
            {account.fund && (
              <Link to={`/fund/${account.fund}`} title={account.fund}>
                Your fund
              </Link>
            )}
          </AccountName>
          <AccountInfo>
            <AccountAddress>
              <Link to="/wallet" title={account.address}>
                Your wallet
              </Link>
            </AccountAddress>
            <AccountNetwork>
              <Link to={{ pathname: '/connect', state: { redirect: location } }} title="Change connection method">
                {environment ? environment.network : 'OFFLINE'}
              </Link>
            </AccountNetwork>
            {account.eth && <AccountBalance>{account.eth?.toFixed(4)} ETH</AccountBalance>}
          </AccountInfo>
        </Account>
      </HeaderContainer>
    </SkeletonHead>
  );
};
