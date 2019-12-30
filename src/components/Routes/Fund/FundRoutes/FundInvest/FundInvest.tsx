import React from 'react';

import { Invest } from './FundInvest/FundInvest';
import { Redeem } from './FundRedeem/FundRedeem';
import { RequiresFundNotShutDown } from '~/components/Common/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';

import * as S from './FundInvest.styles';

export interface FundInvestProps {
  address: string;
}

export const FundInvest: React.FC<FundInvestProps> = ({ address }) => {
  return (
    <S.Wrapper>
      <RequiresFundNotShutDown>
        <Invest address={address} />
      </RequiresFundNotShutDown>
      <Redeem address={address} />
    </S.Wrapper>
  );
};

export default FundInvest;
