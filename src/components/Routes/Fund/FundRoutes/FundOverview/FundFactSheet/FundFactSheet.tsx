import React from 'react';
import format from 'date-fns/format';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { useFundDetailsQuery } from '~/queries/FundDetails';
import { SectionTitle } from '~/storybook/components/Title/Title';
import {
  Dictionary,
  DictionaryDivider,
  DictionaryEntry,
  DictionaryData,
  DictionaryLabel,
} from '~/storybook/components/Dictionary/Dictionary';
import { Block } from '~/storybook/components/Block/Block';
import { EtherscanLink } from '~/components/Common/EtherscanLink/EtherscanLink';

export interface FundFactSheetProps {
  address: string;
}

export const FundFactSheet: React.FC<FundFactSheetProps> = ({ address }) => {
  const [fund, query] = useFundDetailsQuery(address);

  if (!query || query.loading) {
    return (
      <Block>
        <Spinner />
      </Block>
    );
  }

  if (!fund) {
    return null;
  }

  const routes = fund.routes;
  const creation = fund.creationTime;
  const accounting = routes && routes.accounting;
  const shares = routes && routes.shares;
  const version = routes && routes.version;
  const feeManager = routes && routes.feeManager;
  const managementFee = feeManager && feeManager.managementFee;
  const performanceFee = feeManager && feeManager.performanceFee;
  // const sharesOwned = account && account.shares && account.shares.balanceOf;

  return (
    <Dictionary>
      <SectionTitle>Fund factsheet</SectionTitle>
      <DictionaryDivider />
      <DictionaryEntry>
        <DictionaryLabel>Fund name</DictionaryLabel>
        <DictionaryData>{fund.name}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Protocol version</DictionaryLabel>
        <DictionaryData>{version?.name ? version.name : 'N/A'}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Fund address</DictionaryLabel>
        <DictionaryData>
          <EtherscanLink address={address} />
        </DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Manager address</DictionaryLabel>
        <DictionaryData>
          <EtherscanLink address={fund.manager} />
        </DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Inception</DictionaryLabel>
        <DictionaryData>{creation ? format(creation, 'yyyy-MM-dd hh:mm a') : 'N/A'}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Status</DictionaryLabel>
        <DictionaryData>{fund.isShutDown ? 'Inactive' : 'Active'}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Gross asset value</DictionaryLabel>
        <DictionaryData>
          {accounting?.grossAssetValue ? `${accounting.grossAssetValue.toFixed(4)} WETH` : 'N/A'}
        </DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Net asset value</DictionaryLabel>
        <DictionaryData>
          {accounting?.netAssetValue ? `${accounting.netAssetValue.toFixed(4)} WETH` : 'N/A'}
        </DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Total number of shares</DictionaryLabel>
        <DictionaryData>{shares?.totalSupply ? shares.totalSupply.toFixed(4) : 'N/A'}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Share price per share</DictionaryLabel>
        <DictionaryData>{accounting?.sharePrice ? `${accounting.sharePrice.toFixed(4)} WETH` : 'N/A'}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Management fee</DictionaryLabel>
        <DictionaryData>{managementFee?.rate != null ? `${managementFee.rate}%` : 'N/A'}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Performance fee</DictionaryLabel>
        <DictionaryData>{performanceFee?.rate != null ? `${performanceFee.rate}%` : 'N/A'}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Performance fee period</DictionaryLabel>
        <DictionaryData>{performanceFee?.period != null ? `${performanceFee.period} days` : 'N/A'}</DictionaryData>
      </DictionaryEntry>
    </Dictionary>
  );
};
