import React from 'react';
import { useLocation } from 'react-router';
import { Link } from '~/components/Common/Link/Link';
import { useAccount } from '~/hooks/useAccount';
import { useEnvironment } from '~/hooks/useEnvironment';
import {
  Header as HeaderContainer,
  HeaderContent,
  LogoContainer,
  Account,
  AccountAddress,
  AccountBalance,
  AccountInfo,
  AccountNetwork,
  AccountName,
} from '~/storybook/components/Header/Header';
import { SkeletonHead } from '~/storybook/components/Skeleton/Skeleton';
import { Logo } from '~/storybook/components/Logo/Logo';

export const Header: React.FC = () => {
  const environment = useEnvironment();
  const location = useLocation();
  const account = useAccount();
  const network = environment ? environment.network : 'OFFLINE';

  return (
    <SkeletonHead>
      <HeaderContainer>
        <HeaderContent>
          <LogoContainer>
            <Link to="/">
              <Logo name="with-bottom-text" size="small" />
            </Link>
          </LogoContainer>
          <Account>
            {/* TODO: Remove this component */}
            <AccountName />
            <AccountInfo>
              {account.fund && (
                <AccountAddress>
                  <Link to={`/fund/${account.fund}`} title={account.fund}>
                    Your fund
                  </Link>
                </AccountAddress>
              )}
              {account.address && (
                <AccountAddress>
                  <Link to="/wallet" title={account.address}>
                    Your wallet
                  </Link>
                </AccountAddress>
              )}
              <AccountNetwork>
                <Link to={{ pathname: '/connect', state: { redirect: location } }} title="Change connection method">
                  {network}
                </Link>
              </AccountNetwork>
              {account.eth && <AccountBalance>{account.eth.toFixed(4)} ETH</AccountBalance>}
            </AccountInfo>
          </Account>
        </HeaderContent>
      </HeaderContainer>
    </SkeletonHead>
  );
};
