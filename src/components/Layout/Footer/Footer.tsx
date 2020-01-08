import React from 'react';
import { format } from 'date-fns';

import { Link } from '~/components/Common/Link/Link';
import { usePriceFeedUpdateQuery } from '~/queries/PriceFeedUpdate';

import { SkeletonFeet } from '~/storybook/components/Skeleton/Skeleton';
import { Footer as FooterContainer, FooterNavigation, FooterItem } from '~/storybook/components/Footer/Footer';

export const Footer: React.FC = () => {
  const [update] = usePriceFeedUpdateQuery();

  return (
    <SkeletonFeet>
      <FooterContainer>
        <FooterNavigation>
          <FooterItem>
            <a href="https://melonprotocol.com">Protocol</a>
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
              <span>Last price feed update at {format(update, 'yyyy-MM-dd hh:mm a')}</span>
            </FooterItem>
          )}
        </FooterNavigation>
      </FooterContainer>
    </SkeletonFeet>
  );
};
