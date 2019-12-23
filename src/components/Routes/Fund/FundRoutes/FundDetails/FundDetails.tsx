import React from 'react';
import * as S from './FundDetails.styles';
import { FundPolicies } from './FundPolicies/FundPolicies';
import { FundHistoryTabs } from './FundHistoryTabs/FundHistoryTabs';
import { FundHoldings } from '~/components/Routes/Fund/Common/FundHoldings/FundHoldings';
import { useFund } from '~/hooks/useFund';

export const FundDetails: React.FC = () => {
  const fund = useFund();

  return (
    <S.FundDetailsContent>
      <S.FundDetailsOrder>
        <FundHoldings address={fund.address!} />
        <FundPolicies address={fund.address!} />
        <FundHistoryTabs address={fund.address!} />
      </S.FundDetailsOrder>
      <S.FundDetailsLists>{/*Nothing here for now.*/}</S.FundDetailsLists>
    </S.FundDetailsContent>
  );
}

export default FundDetails;
