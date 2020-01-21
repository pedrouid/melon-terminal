import React from 'react';
import { Bar, BarContent } from '~/storybook/components/Bar/Bar';
import { Headline } from '~/storybook/components/Headline/Headline';
import { useAccount } from '~/hooks/useAccount';
import { EtherscanLink } from '~/components/Common/EtherscanLink/EtherscanLink';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { DataBlockSection, DataBlock } from '~/storybook/components/DataBlock/DataBlock';

export const WalletHeader: React.FC = () => {
  const account = useAccount()!;

  return (
    <Bar>
      <BarContent justify="between">
        <Headline title="Your account" text={<EtherscanLink address={account.address} />} icon="wallet" />
        <DataBlockSection>
          <DataBlock label="Balance">
            <FormattedNumber value={fromTokenBaseUnit(account.eth!, 18)} suffix="ETH" />
          </DataBlock>
        </DataBlockSection>
      </BarContent>
    </Bar>
  );
};
