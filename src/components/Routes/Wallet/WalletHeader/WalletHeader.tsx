import React from 'react';
import { Bar, BarContent } from '~/storybook/components/Bar/Bar';
import { Headline } from '~/storybook/components/Headline/Headline';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { useAccount } from '~/hooks/useAccount';

export const WalletHeader: React.FC = () => {
  const account = useAccount()!;
  const link = useEtherscanLink({ address: account.address });

  return (
    <>
      <Bar>
        <BarContent justify="between">
          <Headline
            title="Your account"
            text={<a target="_blank" href={link!}>{account.address}</a>}
            icon="icon"
          />
        </BarContent>
      </Bar>
    </>
  );
};
