import React from 'react';
import { useFundDetailsQuery } from './FundDetails.query';
import { useFundDailyChange } from '~/components/Routes/Fund/FundHeader/FundDailyChange.query';
import { RequiresFundSetupComplete } from '~/components/Gates/RequiresFundSetupComplete/RequiresFundSetupComplete';
import { EtherscanLink } from '~/components/Common/EtherscanLink/EtherscanLink';
import { DataBlock, DataBlockSection } from '~/storybook/components/DataBlock/DataBlock';
import { Bar, BarContent } from '~/storybook/components/Bar/Bar';
import { Headline } from '~/storybook/components/Headline/Headline';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { TokenValue } from '~/components/Common/TokenValue/TokenValue';

export interface FundHeaderProps {
  address: string;
}

export const FundHeader: React.FC<FundHeaderProps> = ({ address }) => {
  const [fund, query] = useFundDetailsQuery(address);
  const [dailyChange, queryDailyChange] = useFundDailyChange(address);

  if (queryDailyChange.loading || query.loading || !fund) {
    return null;
  }

  const routes = fund.routes;
  const accounting = routes && routes.accounting;

  return (
    <Bar>
      <BarContent justify="between">
        <Headline title={fund.name} text={<EtherscanLink address={address} />} icon="fund" />
        <RequiresFundSetupComplete fallback={false}>
          <DataBlockSection>
            <DataBlock label="Share price">
              <TokenValue value={accounting?.sharePrice} decimals={0} symbol="WETH" />
            </DataBlock>

            <DataBlock label="Assets under management">
              <TokenValue value={accounting?.grossAssetValue} decimals={0} symbol="WETH" />
            </DataBlock>

            <DataBlock label="Daily change">
              <FormattedNumber value={dailyChange} colorize={true} decimals={2} suffix="%" />
            </DataBlock>
          </DataBlockSection>
        </RequiresFundSetupComplete>
      </BarContent>
    </Bar>
  );
};
