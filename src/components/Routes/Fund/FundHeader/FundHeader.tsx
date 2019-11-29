import React from 'react';
import format from 'date-fns/format';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { useFundDetailsQuery } from '~/queries/FundDetails';
import * as S from './FundHeader.styles';

export interface FundHeaderProps {
  address: string;
}

export const FundHeader: React.FC<FundHeaderProps> = ({ address }) => {
  const [details, query] = useFundDetailsQuery(address);
  const fundEtherscanLink = useEtherscanLink(address);
  const managerEtherscanLink = useEtherscanLink(details && details.manager);

  if (query.loading) {
    return <Spinner />;
  }

  if (!details) {
    return null;
  }

  const routes = details.routes;
  const accounting = routes && routes.accounting;
  const shares = routes && routes.shares;
  const manager = details.manager;
  const creation = details.creationTime;
  const feeManager = routes && routes.feeManager;
  const managementFee = feeManager && feeManager.managementFee;
  const performanceFee = feeManager && feeManager.performanceFee;

  return (
    <>
      {details.isShutDown && <S.FundHeaderShutDown>This fund is shutdown</S.FundHeaderShutDown>}
      <S.FundHeader>
        <S.FundHeaderHeadline>
          <S.FundHeaderTitle>{details.name}</S.FundHeaderTitle>
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
            {accounting && accounting.sharePrice && accounting.sharePrice.toFixed(4)} WETH / share
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>AUM</S.FundHeaderItemTitle>
            {accounting && accounting.grossAssetValue && accounting.grossAssetValue.toFixed(4)}
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>Ranking</S.FundHeaderItemTitle>
            n/a
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>Creation date</S.FundHeaderItemTitle>
            {format(creation, 'yyyy-MM-dd hh:mm a')}
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>Total number of shares</S.FundHeaderItemTitle>
            {shares && shares.totalSupply && shares.totalSupply.toFixed(4)}
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>Shares owned by me</S.FundHeaderItemTitle>
            TODO
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>Management fee</S.FundHeaderItemTitle>
            {`${managementFee && managementFee.rate ? managementFee.rate : 0}%`}
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>Performance fee</S.FundHeaderItemTitle>
            {`${performanceFee && performanceFee.rate ? performanceFee.rate : 0}%`}
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>Performance fee period</S.FundHeaderItemTitle>
            {`${performanceFee && performanceFee.period ? performanceFee.period : 0} days`}
          </S.FundHeaderItem>
        </S.FundHeaderInformation>
      </S.FundHeader>
    </>
  );
};
