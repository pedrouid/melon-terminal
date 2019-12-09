import React from 'react';
import { useRouteMatch } from 'react-router';
import { useFundExistsQuery } from '~/queries/FundExists';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { FundHeader } from './FundHeader/FundHeader';
import { FundNavigation } from './FundNavigation/FundNavigation';
import { FundOpenOrders } from './FundOpenOrders/FundOpenOrders';
import { FundRedeem } from './FundRedeem/FundRedeem';
import * as S from './Fund.styles';
import { FundShutdown } from './FundShutdown/FundShutdown';
import { FundClaimFees } from './FundClaimFees/FundClaimFees';

export interface FundRouteParams {
  address: string;
}

export const Fund: React.FC = () => {
  const match = useRouteMatch<FundRouteParams>()!;
  const [exists, query] = useFundExistsQuery(match.params.address);
  if (query.loading) {
    return <Spinner positioning="centered" />;
  }

  if (!exists) {
    return (
      <S.FundNotFound>
        <h1>Fund not found</h1>
        <p>The given address {match.params.address} is invalid or is not a fund.</p>
      </S.FundNotFound>
    );
  }

  return (
    <>
      <S.FundHeader>
        <FundHeader address={match.params.address} />
      </S.FundHeader>
      <S.FundBody>
        <S.FundDetailsContent>
          <S.FundDetailsLists>
            <FundOpenOrders address={match.params.address} />
            <FundRedeem address={match.params.address} />
            <FundClaimFees address={match.params.address} />
            <FundShutdown address={match.params.address} />
          </S.FundDetailsLists>
        </S.FundDetailsContent>
      </S.FundBody>
    </>
  );
};

export default Fund;
