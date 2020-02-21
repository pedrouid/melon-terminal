import React from 'react';
import { Bar, BarContent } from '~/storybook/components/Bar/Bar';
import { Headline } from '~/storybook/components/Headline/Headline';
import { useAccount } from '~/hooks/useAccount';
import { EtherscanLink } from '~/components/Common/EtherscanLink/EtherscanLink';
import { DataBlockSection, DataBlock } from '~/storybook/components/DataBlock/DataBlock';
import { TokenValue } from '~/components/Common/TokenValue/TokenValue';

export const WalletHeader: React.FC = () => {
  const account = useAccount()!;

  return (
    <Bar>
      <BarContent justify="between">
        <Headline title="Your account" text={<EtherscanLink address={account.address} />} icon="WALLET" />
        <DataBlockSection>
          <DataBlock label="Balance">
            <TokenValue value={account.eth!} symbol="ETH" />
          </DataBlock>
        </DataBlockSection>
      </BarContent>
    </Bar>
  );
};
