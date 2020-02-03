import React from 'react';
import { useFundMetricsQuery } from '~/queries/FundMetrics';
import { useCoinAPI } from '~/hooks/useCoinAPI';
import {
  Dictionary,
  DictionaryEntry,
  DictionaryLabel,
  DictionaryData,
} from '~/storybook/components/Dictionary/Dictionary';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { GridCol, GridRow } from '~/storybook/components/Grid/Grid';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';

export const FundMetrics: React.FC = () => {
  const [metrics, metricsQuery] = useFundMetricsQuery();
  const coinApi = useCoinAPI();

  if (metricsQuery.loading) {
    return <></>;
  }

  const weiToEth = fromTokenBaseUnit(metrics.melonNetworkHistories[0].gav, 18);
  const mlnPrice = weiToEth.multipliedBy(coinApi.data.rate);

  return (
    <GridRow>
      <GridCol>
        <Dictionary>
          <SectionTitle>Network metrics</SectionTitle>
          <GridRow>
            <GridCol xs={12} sm={6}>
              <DictionaryEntry>
                <DictionaryLabel>Number of funds</DictionaryLabel>
                <DictionaryData>{metrics.funds.length}</DictionaryData>
              </DictionaryEntry>
              <DictionaryEntry>
                <DictionaryLabel>Number of investors</DictionaryLabel>
                <DictionaryData>{metrics.investorCounts[0].numberOfInvestors}</DictionaryData>
              </DictionaryEntry>
            </GridCol>
            <GridCol xs={12} sm={6}>
              <DictionaryEntry>
                <DictionaryLabel>Total AUM (in ETH)</DictionaryLabel>
                <DictionaryData>
                  <FormattedNumber suffix="ETH" value={weiToEth} />
                </DictionaryData>
              </DictionaryEntry>
              <DictionaryEntry>
                <DictionaryLabel>Total AUM (in USD)</DictionaryLabel>
                <DictionaryData>
                  <FormattedNumber suffix="USD" value={mlnPrice} />
                </DictionaryData>
              </DictionaryEntry>
              {/* <DictionaryEntry>
                <DictionaryLabel>Estimated fund setup cost</DictionaryLabel>
                <DictionaryData>
                  <FormattedNumber value={fundSetupCost} suffix="USD" />
                </DictionaryData>
              </DictionaryEntry> */}
            </GridCol>
          </GridRow>
        </Dictionary>
      </GridCol>
    </GridRow>
  );
};
