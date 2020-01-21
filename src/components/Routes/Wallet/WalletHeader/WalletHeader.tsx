import React from 'react';
import { Bar, BarContent } from '~/storybook/components/Bar/Bar';
import { Headline } from '~/storybook/components/Headline/Headline';
import { useAccount } from '~/hooks/useAccount';
import { EtherscanLink } from '~/components/Common/EtherscanLink/EtherscanLink';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';

export const WalletHeader: React.FC = () => {
  const account = useAccount()!;

  return (
    <Bar>
      <BarContent justify="between">
        <Headline title="Your account" text={<EtherscanLink address={account.address} />} icon="wallet" />
        <FormattedNumber value={account.eth} suffix="ETH" />
      </BarContent>
    </Bar>
  );
};
