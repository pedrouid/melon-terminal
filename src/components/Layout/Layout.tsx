import React from 'react';
import { useLocation } from 'react-router';
import { format } from 'date-fns';
import { usePriceFeedUpdateQuery } from '~/queries/PriceFeedUpdate';
import { Link } from '~/storybook/components/Link/Link';
import { useAccount } from '~/hooks/useAccount';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Skeleton, SkeletonHead, SkeletonBody, SkeletonFeet } from '~/storybook/components/Skeleton/Skeleton';
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
import { Footer, FooterNavigation, FooterItem } from '~/storybook/components/Footer/Footer';
import { Logo } from '~/storybook/components/Logo/Logo';

export const Layout: React.FC = ({ children }) => {
  const [update] = usePriceFeedUpdateQuery();
  const environment = useEnvironment();
  const location = useLocation();
  const account = useAccount();
  const network = environment ? environment.network : 'OFFLINE';

  return (
    <Skeleton>
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
      <SkeletonBody>{children}</SkeletonBody>
      <SkeletonFeet>
        <Footer>
          <FooterNavigation>
            <FooterItem>
              <a href="https://melonprotocol.com">About</a>
            </FooterItem>
            <FooterItem>
              <a href="https://docs.melonport.com">Documentation</a>
            </FooterItem>
            <FooterItem>
              <a href="https://github.com/Avantgarde-Finance/manager-interface/issues">Report an issue</a>
            </FooterItem>
            <FooterItem>
              <Link to="/playground/onchain">Network explorer</Link>
            </FooterItem>
            <FooterItem>
              <Link to="/playground/thegraph">Graph explorer</Link>
            </FooterItem>
            {update && (
              <FooterItem>
                <span>Last pricefeed update at {format(update, 'yyyy-MM-dd hh:mm a')}</span>
              </FooterItem>
            )}
          </FooterNavigation>
        </Footer>
      </SkeletonFeet>
    </Skeleton>
  );
};
