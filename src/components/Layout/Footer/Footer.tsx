import React from 'react';
import { format } from 'date-fns';

import { Link } from '~/components/Common/Link/Link';
import { usePriceFeedUpdateQuery } from '~/queries/PriceFeedUpdate';

import { SkeletonFeet } from '~/storybook/components/Skeleton/Skeleton';

export const Footer: React.FC = () => {
  const [update] = usePriceFeedUpdateQuery();

  return (
    <SkeletonFeet>
      <a href="https://melonprotocol.com">Protocol</a>
      <a href="https://docs.melonport.com">Documentation</a>
      <a href="https://github.com/Avantgarde-Finance/manager-interface/issues">Report an issue</a>
      <Link to="/playground/onchain">Network explorer</Link>
      <Link to="/playground/thegraph">Graph explorer</Link>
      {update && <span>Last price feed update at {format(update, 'yyyy-MM-dd hh:mm a')}</span>}
    </SkeletonFeet>
  );
};
