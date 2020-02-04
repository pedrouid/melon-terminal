import React, { useEffect } from 'react';
import { NotificationBar, NotificationContent } from '~/storybook/components/NotificationBar/NotificationBar';
import { ShareFundQuery } from '~/queries/ShareFund';
import { Icons } from '~/storybook/components/Icons/Icons';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useLazyOnChainQuery } from '~/hooks/useQuery';

export interface ShareFundProps {
  address: string;
}

export const ShareFund: React.FC<ShareFundProps> = ({ address }) => {
  const [fetch, result] = useLazyOnChainQuery(ShareFundQuery);
  const environment = useEnvironment();

  const onClick = () => {
    if (result.loading) return;

    fetch({
      variables: {
        fund: address,
      },
    });
  };

  useEffect(() => {
    if (!result.data) {
      return;
    }

    const formattedData = {
      name: result.data?.fund?.name,
      managementFee: result.data?.fund?.routes?.feeManager?.managementFee?.rate,
      performanceFee: result.data?.fund?.routes?.feeManager?.performanceFee?.rate,
      tokens: result.data?.fund?.routes?.participation?.allowedAssets?.map(e => e.token?.symbol),
      exchanges: result.data?.fund?.routes?.trading?.exchanges?.map(e => {
        const item = environment?.getExchange(e.exchange!);
        return item && item.name;
      }),
    };

    const tokens = formattedData?.tokens?.map(token => `$${token}`).join(', ');
    const exchanges = formattedData?.exchanges?.join(', ');

    const formatedTwitterText = `I just deployed an on-chain fund to @ethereum, powered by @melonprotocol. My fund's name is ${formattedData?.name}, it has a ${formattedData?.managementFee}% management fee, ${formattedData?.performanceFee}% performance fee, can trade on with ${exchanges} and accepts ${tokens} as subscription assets `;

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(formatedTwitterText)}${window.location.href}`
    );
  }, [result.data]);

  return (
    <NotificationBar kind="neutral">
      <NotificationContent>
        Tell the world about your on-chain investment vehicle{' '}
        <a onClick={onClick}>
          <Icons name="TWITTER" size="small" />
        </a>
      </NotificationContent>
    </NotificationBar>
  );
};

export default ShareFund;
