import React from 'react';
import format from 'date-fns/format';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { useFundDetailsQuery } from '~/queries/FundDetails';
import { useFundInvestQuery } from '~/queries/FundInvest';
import * as S from './FundHeader.styles';

export interface FundHeaderProps {
  address: string;
}

export const FundHeader: React.FC<FundHeaderProps> = ({ address }) => {
  const [details, detailsQuery] = useFundDetailsQuery(address);
  const [investments, investQuery] = useFundInvestQuery(address);
  const fundEtherscanLink = useEtherscanLink({ address });

  if (!(!detailsQuery.loading && !investQuery.loading)) {
    return <Spinner />;
  }

  if (!details) {
    return null;
  }

  const routes = details.routes;
  const shares = routes && routes.shares;
  const creation = details.creationTime;
  const feeManager = routes && routes.feeManager;
  const managementFee = feeManager && feeManager.managementFee;
  const performanceFee = feeManager && feeManager.performanceFee;
  const accountShares = investments && investments.account && investments.account.shares;

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
            <S.FundHeaderItemTitle>Creation date</S.FundHeaderItemTitle>
            {format(creation, 'yyyy-MM-dd hh:mm a')}
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>Total number of shares</S.FundHeaderItemTitle>
            {shares && shares.totalSupply && shares.totalSupply.toFixed(8)}
          </S.FundHeaderItem>
          <S.FundHeaderItem>
            <S.FundHeaderItemTitle>Shares owned by you</S.FundHeaderItemTitle>
            {accountShares && accountShares.balanceOf && accountShares.balanceOf.toFixed(8)}
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
