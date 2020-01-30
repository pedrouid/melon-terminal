import React from 'react';
import { format } from 'date-fns';
import { useLocation } from 'react-router';
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
import { useEnvironment } from '~/hooks/useEnvironment';
import { Icons } from '~/storybook/components/Icons/Icons';
import { NetworkEnum } from '~/types';
import { useVersionQuery } from '~/queries/Version';

const graphiql = JSON.parse(process.env.MELON_INCLUDE_GRAPHIQL || 'false');

export const Layout: React.FC = ({ children }) => {
  const location = useLocation()!;
  const [update] = usePriceFeedUpdateQuery();
  const environment = useEnvironment();
  const account = useAccount();
  const [version] = useVersionQuery();

  const home = location.pathname === '/';

  return (
    <Skeleton>
      <SkeletonHead>
        <HeaderContainer>
          <HeaderContent>
            <HeaderTitle>
              <Link to="/">
                {!home && <Icons name="LEFTARROW" size="small" />}
                <span>Melon Manager Interface</span>
              </Link>
            </HeaderTitle>
            <LogoContainer>
              <Logo name="with-bottom-text" size="small" />
            </LogoContainer>
            <ConnectionInfo>
              {account.fund && (
                <ConnectionInfoItem>
                  <NavLink to={`/fund/${account.fund}`} title={account.fund} activeClassName="active">
                    My fund
                  </NavLink>
                </ConnectionInfoItem>
              )}

              {!account.fund && account.address && (
                <ConnectionInfoItem>
                  <NavLink to={`/wallet/setup`} title={account.fund} activeClassName="active" exact={true}>
                    Create fund
                  </NavLink>
                </ConnectionInfoItem>
              )}

              {account.address && (
                <ConnectionInfoItem>
                  <NavLink to="/wallet" title={account.address} activeClassName="active" exact={true}>
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
              <a href="https://github.com/avantgardefinance/interface/issues" target="_blank">
                Report an issue
              </a>
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

            {environment?.network && <FooterItem>{NetworkEnum[environment.network]}</FooterItem>}

            {version && <FooterItem>Protocol {version.name}</FooterItem>}
          </FooterNavigation>
        </Footer>
      </SkeletonFeet>
    </Skeleton>
  );
};
