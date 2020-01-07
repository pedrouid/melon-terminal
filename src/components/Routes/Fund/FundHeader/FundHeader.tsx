import React from 'react';
import format from 'date-fns/format';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { useFundDetailsQuery } from '~/queries/FundDetails';
import * as S from './FundHeader.styles';
import { BarContent, BarSection } from '~/storybook/components/Bar/Bar';

import { Headline } from '~/storybook/components/Headline/Headline';
import { DataBlock } from '~/storybook/components/DataBlock/DataBlock';

export interface FundHeaderProps {
  address: string;
}

export const FundHeader: React.FC<FundHeaderProps> = ({ address }) => {
  const [details, accountDetails, query] = useFundDetailsQuery(address);
  const fundEtherscanLink = useEtherscanLink({ address });
  // const managerEtherscanLink = useEtherscanLink(details && details.manager);

  if (!query || query.loading) {
    return <Spinner />;
  }

  if (!details) {
    return null;
  }

  const routes = details.routes;
  const accounting = routes && routes.accounting;
  const shares = routes && routes.shares;
  // const manager = details.manager;
  const creation = details.creationTime;
  const feeManager = routes && routes.feeManager;
  const managementFee = feeManager && feeManager.managementFee;
  const performanceFee = feeManager && feeManager.performanceFee;
  const sharesOwned = accountDetails && accountDetails.shares && accountDetails.shares.balanceOf;

  return (
    <BarContent>
      {details.isShutDown && <S.FundHeaderShutDown>This fund is shutdown</S.FundHeaderShutDown>}
      <Headline
        title={details.name}
        text={
          <a href={fundEtherscanLink!} title={address}>
            View on etherscan
          </a>
        }
      />
      <BarSection>
        <DataBlock label="Share price">{accounting?.sharePrice?.toFixed(4) || 0} WETH / share</DataBlock>
        <DataBlock label="AUM">{accounting?.grossAssetValue?.toFixed(4) || 0}</DataBlock>
      </BarSection>
      <BarSection>
        <DataBlock label="Creation date">{creation && format(creation, 'yyyy-MM-dd hh:mm a')}</DataBlock>
        <DataBlock label="Total number of shares">{shares?.totalSupply?.toFixed(4)}</DataBlock>
        <DataBlock label="Shares owned by me">{sharesOwned?.toFixed(4)}</DataBlock>
      </BarSection>
      <BarSection>
        <DataBlock label="Management fee">{`${managementFee?.rate ?? 0}%`}</DataBlock>
        <DataBlock label="Performance fee">{`${performanceFee?.rate ?? 0}%`}</DataBlock>
        <DataBlock label="Performance fee period">{`${performanceFee?.period ?? 0} days`}</DataBlock>
      </BarSection>
    </BarContent>
  );
};
