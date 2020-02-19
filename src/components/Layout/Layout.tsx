import React from 'react';
import { format } from 'date-fns';
import { useLocation } from 'react-router';
import { usePriceFeedUpdateQuery } from '~/components/Layout/PriceFeedUpdate.query';
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
  LogoDesktop,
  LogoMobile,
} from '~/storybook/components/Header/Header';
import { Footer, FooterNavigation, FooterItem } from '~/storybook/components/Footer/Footer';
import { Logo } from '~/storybook/components/Logo/Logo';
import { ConnectionSelector } from './ConnectionSelector/ConnectionSelector';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Icons } from '~/storybook/components/Icons/Icons';
import { NetworkEnum } from '~/types';
import { useVersionQuery } from '~/components/Layout/Version.query';
import * as S from './Layout.styles';

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
                <S.AppName>Melon Terminal</S.AppName>
              </Link>
            </HeaderTitle>
            <LogoContainer>
              <LogoDesktop>
                <Logo name="with-bottom-text" size="small" />
              </LogoDesktop>
              <LogoMobile>
                <Link to="/">
                  <Logo name="with-bottom-text" size="small" />
                </Link>
              </LogoMobile>
            </LogoContainer>
            <ConnectionInfo>
              {!account.loading && account.fund && (
                <ConnectionInfoItem>
                  <NavLink to={`/fund/${account.fund}`} title={account.fund} activeClassName="active">
                    My Fund
                  </NavLink>
                </ConnectionInfoItem>
              )}

              {!account.loading && !account.fund && account.address && (
                <ConnectionInfoItem>
                  <NavLink to={`/wallet/setup`} title={account.fund} activeClassName="active" exact={true}>
                    Create a Fund
                  </NavLink>
                </ConnectionInfoItem>
              )}

              {account.address && (
                <ConnectionInfoItem>
                  <NavLink to="/wallet" title={account.address} activeClassName="active" exact={true}>
                    My Wallet
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
                Report an Issue
              </a>
            </FooterItem>

            {graphiql && (
              <>
                <FooterItem>
                  <Link to="/playground/onchain">Network Explorer</Link>
                </FooterItem>
                <FooterItem>
                  <Link to="/playground/thegraph">Graph Explorer</Link>
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
