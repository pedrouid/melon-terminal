import React from 'react';

import { useFundDetailsQuery } from '~/queries/FundDetails';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { RequiresFundSetupComplete } from '~/components/Common/Gates/RequiresFundSetupComplete/RequiresFundSetupComplete';

import { DataBlock, DataBlockSection } from '~/storybook/components/DataBlock/DataBlock';
import { Bar, BarContent } from '~/storybook/components/Bar/Bar';
import { Headline } from '~/storybook/components/Headline/Headline';

export interface FundHeaderProps {
  address: string;
}

export const FundHeader: React.FC<FundHeaderProps> = ({ address }) => {
  const [fund] = useFundDetailsQuery(address);
  const link = useEtherscanLink({ address });

  if (!fund) {
    return null;
  }

  const routes = fund.routes;
  const accounting = routes && routes.accounting;

  return (
    <Bar>
      <BarContent justify="between">
        <Headline
          title={fund.name}
          text={
            <a target="_blank" href={link!}>
              {address}
            </a>
          }
          icon="fund"
        />
        <RequiresFundSetupComplete fallback={false}>
          <DataBlockSection>
            <DataBlock label="Share price per share">
              {accounting?.sharePrice ? `${accounting.sharePrice.toFixed(4)} WETH` : 'N/A'}
            </DataBlock>
            <DataBlock label="Assets under management">
              {accounting?.grossAssetValue ? `${accounting.grossAssetValue.toFixed(4)} WETH` : 'N/A'}
            </DataBlock>
          </DataBlockSection>
        </RequiresFundSetupComplete>
      </BarContent>
    </Bar>
  );
};
