import React from 'react';

import { useFund } from '~/hooks/useFund';
import { PageTitle } from '~/components/Contexts/PageTitle/PageTitle';

export const FundTitle: React.FC = () => {
  const fund = useFund();

  return <PageTitle>{fund.name}</PageTitle>;
};
