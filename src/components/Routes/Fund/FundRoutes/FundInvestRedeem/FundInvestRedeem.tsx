import React from 'react';
import { FundInvest } from './FundInvest/FundInvest';
import { FundRedeem } from './FundRedeem/FundRedeem';
import { RequiresFundNotShutDown } from '~/components/Common/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';
import { FundInvestmentHistoryList } from './FundInvestmentHistoryList/FundInvestmentHistoryList';
import { FundInvestorsList } from './FundInvestorsList/FundInvestorsList';
import * as S from './FundInvestRedeem.styles';

export interface FundInvestProps {
  address: string;
}

export const FundInvestRedeem: React.FC<FundInvestProps> = ({ address }) => {
  return (
    <S.FundInvestRedeemBody>
      <RequiresFundNotShutDown fallback={false}>
        <FundInvest address={address} />
      </RequiresFundNotShutDown>
      <FundRedeem address={address} />
      <FundInvestmentHistoryList address={address} />
      <FundInvestorsList address={address} />
    </S.FundInvestRedeemBody>
  );
};

export default FundInvestRedeem;
