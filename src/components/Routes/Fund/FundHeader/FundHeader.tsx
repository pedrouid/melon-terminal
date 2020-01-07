import React from 'react';
import format from 'date-fns/format';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { useFundDetailsQuery } from '~/queries/FundDetails';
import { DataBlock } from '~/storybook/components/DataBlock/DataBlock';
import { DataBlockBarContent, DataBlockBar } from '~/storybook/components/DataBlockBar/DataBlockBar';

export interface FundHeaderProps {
  address: string;
}

export const FundHeader: React.FC<FundHeaderProps> = ({ address }) => {
  const [fund, account, query] = useFundDetailsQuery(address);

  if (!query || query.loading) {
    return <Spinner />;
  }

  if (!fund) {
    return null;
  }

  const routes = fund.routes;
  const accounting = routes && routes.accounting;
  const shares = routes && routes.shares;
  const creation = fund.creationTime;
  const feeManager = routes && routes.feeManager;
  const managementFee = feeManager && feeManager.managementFee;
  const performanceFee = feeManager && feeManager.performanceFee;
  const sharesOwned = account && account.shares && account.shares.balanceOf;

  return (
    <DataBlockBar>
      <DataBlockBarContent>
        <DataBlock label="Share price">{accounting?.sharePrice?.toFixed(4) || 0} WETH / share</DataBlock>
        <DataBlock label="AUM">{accounting?.grossAssetValue?.toFixed(4) || 0}</DataBlock>
        <DataBlock label="Creation date">{creation && format(creation, 'yyyy-MM-dd hh:mm a')}</DataBlock>
        <DataBlock label="Total number of shares">{shares?.totalSupply?.toFixed(4)}</DataBlock>
        <DataBlock label="Shares owned by me">{sharesOwned?.toFixed(4)}</DataBlock>
        <DataBlock label="Management fee">{`${managementFee?.rate ?? 0}%`}</DataBlock>
        <DataBlock label="Performance fee">{`${performanceFee?.rate ?? 0}%`}</DataBlock>
        <DataBlock label="Performance fee period">{`${performanceFee?.period ?? 0} days`}</DataBlock>
      </DataBlockBarContent>
    </DataBlockBar>
  );
};
