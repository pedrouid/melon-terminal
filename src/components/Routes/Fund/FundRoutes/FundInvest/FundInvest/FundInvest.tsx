import React, { useMemo } from 'react';
import * as S from './FundInvest.styles';
import { useFundInvestQuery } from '~/queries/FundInvest';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import RequestInvestment from './RequestInvestment/RequestInvestment';
import ExecuteRequest from './ExecuteRequest/ExecuteRequest';
import CancelRequest from './CancelRequest/CancelRequest';

export interface InvestProps {
  address: string;
}

export const Invest: React.FC<InvestProps> = ({ address }) => {
  const [fundQueryData, fundQuery] = useFundInvestQuery(address);

  const fund = fundQueryData && fundQueryData.fund;
  const account = fundQueryData && fundQueryData.account;

  const holdings = fund && fund.routes && fund.routes.accounting && fund.routes.accounting.holdings;
  const investmentRequestState = account && account.participation && account.participation.investmentRequestState;
  const canCancelRequest = account && account.participation && account.participation.canCancelRequest;

  const action = useMemo(() => {
    if (investmentRequestState === 'VALID') {
      return 'execute';
    }

    if (investmentRequestState === 'WAITING') {
      return 'waiting';
    }

    if (investmentRequestState === 'NONE') {
      return 'invest';
    }
  }, [investmentRequestState]);

  if (fundQuery.loading) {
    return (
      <S.FundInvestBody>
        <Spinner positioning="centered" />
      </S.FundInvestBody>
    );
  }

  return (
    <S.FundInvestBody>
      <h1>Invest</h1>
      {action === 'invest' && (
        <RequestInvestment address={address} holdings={holdings} account={account!} fundQuery={fundQuery} />
      )}
      {action === 'execute' && <ExecuteRequest address={address} account={account!} fundQuery={fundQuery} />}
      {action === 'waiting' && (
        <p>
          You need to wait before you can execute your investment request. The time-window to execute your investment
          request is between the next price update and 24 hours after your investment request .
        </p>
      )}
      {canCancelRequest && <CancelRequest address={address} account={account!} fundQuery={fundQuery} />}
    </S.FundInvestBody>
  );
};

export default Invest;
