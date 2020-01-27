import React, { useMemo } from 'react';
import { useFundDetailsQuery } from '~/queries/FundDetails';
import { useFundDailyChange } from '~/queries/FundDailyChange';
import { RequiresFundSetupComplete } from '~/components/Gates/RequiresFundSetupComplete/RequiresFundSetupComplete';
import { EtherscanLink } from '~/components/Common/EtherscanLink/EtherscanLink';
import { DataBlock, DataBlockSection } from '~/storybook/components/DataBlock/DataBlock';
import { Bar, BarContent } from '~/storybook/components/Bar/Bar';
import { Headline } from '~/storybook/components/Headline/Headline';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { useCurrency } from '~/hooks/useCurrency';
import BigNumber from 'bignumber.js/';

export interface FundHeaderProps {
  address: string;
}

export const FundHeader: React.FC<FundHeaderProps> = ({ address }) => {
  const [fund, query] = useFundDetailsQuery(address);
  const [dailyChange, queryDailyChange] = useFundDailyChange(address);
  const currency = useCurrency();

  const rate = new BigNumber(currency.current.data?.rate || 1);
  const symbol = currency.current.symbol || 'WETH';

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
              <FormattedNumber value={accounting?.sharePrice.times(rate)} suffix={symbol} />
            </DataBlock>

            <DataBlock label="Assets under management">
              <FormattedNumber value={accounting?.grossAssetValue.times(rate)} suffix={symbol} />
            </DataBlock>

            <DataBlock label="Daily change*">
              <FormattedNumber value={dailyChange} colorize={true} decimals={2} suffix="%" />
            </DataBlock>
          </DataBlockSection>
        </RequiresFundSetupComplete>
      </BarContent>
    </Bar>
  );
};
