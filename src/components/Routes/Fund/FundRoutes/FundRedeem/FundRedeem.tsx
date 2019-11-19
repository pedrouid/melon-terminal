import React from 'react';
import * as S from './FundRedeem.styles';
import { PaddedBody } from '~/components/Common/Styles/Styles';

export interface RedeemProps {
  address: string;
}

export const Redeem: React.FC<RedeemProps> = ({ address }) => {
  return (
    <S.FundRedeemBody>
      <h1>Not yet implemented</h1>
    </S.FundRedeemBody>
  );
};

export default Redeem;
