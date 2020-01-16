import React from 'react';
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
  ConnectionInfo,
  ConnectionInfoItem,
} from '~/storybook/components/Header/Header';
import { Footer, FooterNavigation, FooterItem } from '~/storybook/components/Footer/Footer';
import { Logo } from '~/storybook/components/Logo/Logo';
import { ConnectionSelector } from './ConnectionSelector/ConnectionSelector';

const graphiql = JSON.parse(process.env.MELON_INCLUDE_GRAPHIQL || 'false');

export const Layout: React.FC = ({ children }) => {
  const [update] = usePriceFeedUpdateQuery();
  const account = useAccount();

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
            <ConnectionInfo>
              {account.fund && (
                <ConnectionInfoItem>
                  <Link to={`/fund/${account.fund}`} title={account.fund}>
                    Your fund
                  </Link>
                </ConnectionInfoItem>
              )}
              {account.address && (
                <ConnectionInfoItem>
                  <Link to="/wallet" title={account.address}>
                    Your wallet
                  </Link>
                </ConnectionInfoItem>
              )}
              <ConnectionInfoItem>
                <ConnectionSelector />
              </ConnectionInfoItem>
              {account.eth && <ConnectionInfoItem>{account.eth.toFixed(4)} ETH</ConnectionInfoItem>}
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
              <a href="https://github.com/Avantgarde-Finance/manager-interface/issues">Report an issue</a>
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
          </FooterNavigation>
        </Footer>
      </SkeletonFeet>
    </Skeleton>
  );
};
