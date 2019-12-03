import React from 'react';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import * as S from './FundOpenOrders.styles';
import { useFundPoliciesQuery } from '~/queries/FundPolicies';
import { useEnvironment } from '~/hooks/useEnvironment';

export interface FundOpenOrdersProps {
  address: string;
}

export const FundOpenOrders: React.FC<FundOpenOrdersProps> = ({ address }) => {
  return (
    <S.Wrapper>
      <S.Title>Open Orders</S.Title>
      <p>empty</p>
    </S.Wrapper>
  );
};

export default FundOpenOrders;
