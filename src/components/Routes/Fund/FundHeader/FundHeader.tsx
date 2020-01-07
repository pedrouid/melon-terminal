import React from 'react';
import format from 'date-fns/format';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { useFundDetailsQuery } from '~/queries/FundDetails';
import * as S from './FundHeader.styles';

import { Title } from '~/storybook/components/Title/Title';

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
    <>
      {details.isShutDown && <S.FundHeaderShutDown>This fund is shutdown</S.FundHeaderShutDown>}
      <S.FundHeader>
        <S.FundHeaderHeadline>
          <Title>{details.name}</Title>
          <S.FundHeaderLinks>
            {
              <a href={fundEtherscanLink!} title={address}>
                View on etherscan
              </a>
            }
          </S.FundHeaderLinks>
        </S.FundHeaderHeadline>
        <S.FundHeaderInformation>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>Share price</S.FundHeaderItemTitle>
            {accounting?.sharePrice?.toFixed(4) || 0} WETH / share
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>AUM</S.FundHeaderItemTitle>
            {accounting?.grossAssetValue?.toFixed(4) || 0}
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>Creation date</S.FundHeaderItemTitle>
            {creation && format(creation, 'yyyy-MM-dd hh:mm a')}
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>Total number of shares</S.FundHeaderItemTitle>
            {shares?.totalSupply?.toFixed(4)}
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>Shares owned by me</S.FundHeaderItemTitle>
            {sharesOwned?.toFixed(4)}
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>Management fee</S.FundHeaderItemTitle>
            {`${managementFee?.rate ?? 0}%`}
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>Performance fee</S.FundHeaderItemTitle>
            {`${performanceFee?.rate ?? 0}%`}
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>Performance fee period</S.FundHeaderItemTitle>
            {`${performanceFee?.period ?? 0} days`}
          </S.FundHeaderItem>
        </S.FundHeaderInformation>
      </S.FundHeader>
    </>
  );
};
