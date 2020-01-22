import React from 'react';
import { format } from 'date-fns';
import { usePriceFeedUpdateQuery } from '~/queries/PriceFeedUpdate';
import { Link, NavLink } from '~/storybook/components/Link/Link';
import { useAccount } from '~/hooks/useAccount';
import { Skeleton, SkeletonHead, SkeletonBody, SkeletonFeet } from '~/storybook/components/Skeleton/Skeleton';
import {
  Header as HeaderContainer,
  HeaderContent,
  LogoContainer,
  ConnectionInfo,
  ConnectionInfoItem,
  HeaderTitle,
} from '~/storybook/components/Header/Header';
import { Footer, FooterNavigation, FooterItem } from '~/storybook/components/Footer/Footer';
import { Logo } from '~/storybook/components/Logo/Logo';
import { ConnectionSelector } from './ConnectionSelector/ConnectionSelector';
import { useConnectionState } from '~/hooks/useConnectionState';
import { useEnvironment } from '~/hooks/useEnvironment';

const graphiql = JSON.parse(process.env.MELON_INCLUDE_GRAPHIQL || 'false');

export const Layout: React.FC = ({ children }) => {
  const [update] = usePriceFeedUpdateQuery();
  const environment = useEnvironment();
  const account = useAccount();

  return (
    <Skeleton>
      <SkeletonHead>
        <HeaderContainer>
          <HeaderContent>
            <HeaderTitle>
              <Link to="/">Melon Manager Interface</Link>
            </HeaderTitle>
            <LogoContainer>
              <Link to="/">
                <Logo name="with-bottom-text" size="small" />
              </Link>
            </LogoContainer>
            <ConnectionInfo>
              {account.fund && (
                <ConnectionInfoItem>
                  <NavLink to={`/fund/${account.fund}`} title={account.fund} activeClassName="active">
                    My fund
                  </NavLink>
                </ConnectionInfoItem>
              )}

              {account.address && (
                <ConnectionInfoItem>
                  <NavLink to="/wallet" title={account.address} activeClassName="active">
                    My wallet
                  </NavLink>
                </ConnectionInfoItem>
              )}
              <ConnectionInfoItem>
                <ConnectionSelector />
              </ConnectionInfoItem>
            </ConnectionInfo>
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
              <a href="https://github.com/avantgardefinance/interface/issues">Report an issue</a>
            </FooterItem>

            {graphiql && (
              <>
                <FooterItem>
                  <Link to="/playground/onchain">Network explorer</Link>
                </FooterItem>
                <FooterItem>
                  <Link to="/playground/thegraph">Graph explorer</Link>
                </FooterItem>
              </>
            )}

            {update && (
              <FooterItem>
                <span>Last pricefeed update at {format(update, 'yyyy-MM-dd hh:mm a')}</span>
              </FooterItem>
            )}

            {environment?.network && <FooterItem>{environment.network}</FooterItem>}
          </FooterNavigation>
        </Footer>
      </SkeletonFeet>
    </Skeleton>
  );
};
