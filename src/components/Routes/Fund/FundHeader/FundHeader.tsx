import React from 'react';
import format from 'date-fns/format';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { useFund } from '~/hooks/useFund';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { RequiresFundSetupComplete } from '~/components/Common/Gates/RequiresFundSetupComplete/RequiresFundSetupComplete';
import * as S from './FundHeader.styles';
import { useFundHeaderQuery } from './FundHeader.query';

export const FundHeader: React.FC = () => {
  const fund = useFund();
  const link = useEtherscanLink({ address: fund.address });
  const [details, query] = useFundHeaderQuery({
    skip: !(fund.address && fund.progress === 'COMPLETE'),
    variables: { address: fund.address },
  });

  if (query.loading) {
    return <Spinner />;
  }

  // const routes = details?.routes;
  // const creation = details?.creationTime;
  // const accounting = routes && routes.accounting;
  // const shares = routes && routes.shares;
  // const feeManager = routes && routes.feeManager;
  // const managementFee = feeManager && feeManager.managementFee;
  // const performanceFee = feeManager && feeManager.performanceFee;
  // const sharesOwned = account && account.shares && account.shares.balanceOf;

  return (
    <>
      {fund?.isShutDown && <S.FundHeaderShutDown>This fund is shutdown</S.FundHeaderShutDown>}
      <S.FundHeader>
        <S.FundHeaderHeadline>
          <S.FundHeaderTitle>{fund?.name}</S.FundHeaderTitle>
          <S.FundHeaderLinks><a href={link!} title={fund?.address}>View on etherscan</a></S.FundHeaderLinks>
        </S.FundHeaderHeadline>
        <RequiresFundSetupComplete>
          {/* <S.FundHeaderInformation>
            <S.FundHeaderItem>
              <S.FundHeaderItemTitle>Share price</S.FundHeaderItemTitle>
              {(accounting && accounting.sharePrice && accounting.sharePrice.toFixed(4)) || 0} WETH / share
            </S.FundHeaderItem>
            <S.FundHeaderItem>
              <S.FundHeaderItemTitle>AUM</S.FundHeaderItemTitle>
              {(accounting && accounting.grossAssetValue && accounting.grossAssetValue.toFixed(4)) || 0}
            </S.FundHeaderItem>
            <S.FundHeaderItem>
              <S.FundHeaderItemTitle>Ranking</S.FundHeaderItemTitle>
              n/a
            </S.FundHeaderItem>
            <S.FundHeaderItem>
              <S.FundHeaderItemTitle>Creation date</S.FundHeaderItemTitle>
              {creation && format(creation, 'yyyy-MM-dd hh:mm a')}
            </S.FundHeaderItem>
            <S.FundHeaderItem>
              <S.FundHeaderItemTitle>Total number of shares</S.FundHeaderItemTitle>
              {shares && shares.totalSupply && shares.totalSupply.toFixed(4)}
            </S.FundHeaderItem>
            <S.FundHeaderItem>
              <S.FundHeaderItemTitle>Shares owned by me</S.FundHeaderItemTitle>
              {sharesOwned && sharesOwned.toFixed(4)}
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
          </S.FundHeaderInformation> */}
        </RequiresFundSetupComplete>
      </S.FundHeader>
    </>
  );
};
