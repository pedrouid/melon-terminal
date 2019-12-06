import React from 'react';

import { Pagination } from '~/components/Common/Pagination/Pagination';

export interface FundOverviewPaginationProps {
  offset: number;
  setOffset: (value: number) => void;
  funds: number;
}

export const FundOverviewPagination: React.FC<FundOverviewPaginationProps> = ({ offset, setOffset, funds }) => {
  return (
    <Pagination
      hasPrevious={offset <= 0}
      hasNext={offset + 20 >= funds}
      previous={() => setOffset(offset - 20)}
      next={() => setOffset(offset + 20)}
      first={() => setOffset(0)}
      last={() => setOffset(funds - (funds % 20))}
      actual={offset}
      totalItems={funds}
    />
  );
};
