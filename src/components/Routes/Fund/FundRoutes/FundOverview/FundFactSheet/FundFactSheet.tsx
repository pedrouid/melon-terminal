import React from 'react';
import format from 'date-fns/format';
import { Spinner } from '~/components/Common/Spinner/Spinner';
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
  const accounting = routes && routes.accounting;
  // const shares = routes && routes.shares;
  const creation = fund.creationTime;
  const feeManager = routes && routes.feeManager;
  const managementFee = feeManager && feeManager.managementFee;
  const performanceFee = feeManager && feeManager.performanceFee;
  // const sharesOwned = account && account.shares && account.shares.balanceOf;

  return (
    <Dictionary>
      <SectionTitle>Fund Fact Sheet</SectionTitle>
      <DictionaryDivider />
      <DictionaryEntry>
        <DictionaryLabel>Fund name</DictionaryLabel>
        <DictionaryData>{fund.name}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Protocol version</DictionaryLabel>
        <DictionaryData></DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Fund address</DictionaryLabel>
        <DictionaryData>{address}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Manager address</DictionaryLabel>
        <DictionaryData>{fund.manager}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Inception</DictionaryLabel>
        <DictionaryData>{creation && format(creation, 'yyyy-MM-dd hh:mm a')}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Status</DictionaryLabel>
        <DictionaryData>{fund.isShutDown ? 'Inactive' : 'Active'}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>GAV</DictionaryLabel>
        <DictionaryData></DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>NAV</DictionaryLabel>
        <DictionaryData></DictionaryData>
      </DictionaryEntry>
      {/* <DictionaryEntry>
        <DictionaryLabel>Total number of shares</DictionaryLabel>
        <DictionaryData>{shares?.totalSupply?.toFixed(4)}</DictionaryData>
      </DictionaryEntry> */}
      <DictionaryEntry>
        <DictionaryLabel>Share price</DictionaryLabel>
        <DictionaryData>{accounting?.sharePrice?.toFixed(4) || 0} WETH / share</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Management fee</DictionaryLabel>
        <DictionaryData>{`${managementFee?.rate ?? 0}%`}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Performance fee</DictionaryLabel>
        <DictionaryData>{`${performanceFee?.rate ?? 0}%`}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Performance fee period</DictionaryLabel>
        <DictionaryData>{`${performanceFee?.period ?? 0} days`}</DictionaryData>
      </DictionaryEntry>
    </Dictionary>
  );
};

export default FundFactSheet;
