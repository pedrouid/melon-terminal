import React, { useState, useMemo } from 'react';
import { useHistory } from 'react-router';

import { FundOverviewChange } from '~/components/Routes/Home/FundOverview/FundOverviewChange/FundOverviewChange';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { NoMatch } from '~/components/Routes/NoMatch/NoMatch';
import { Pagination } from '~/components/Common/Pagination/Pagination';
import { useFundOverviewQuery, FundProcessed } from '~/queries/FundOverview';
import { usePagination } from '~/hooks/usePagination';
import * as S from './FundOverview.styles';

interface SortChoice {
  key: keyof typeof sortChoice;
  order: 'asc' | 'desc';
}

function createSortString(key: keyof FundProcessed) {
  return function sortString(a: FundProcessed, b: FundProcessed): number {
    if (a[key] === b[key]) {
      return 0;
    }

    return a[key] < b[key] ? -1 : 1;
  };
}

function createSortNumberFromString(key: keyof FundProcessed) {
  return function sortNumberFromString(a: FundProcessed, b: FundProcessed): number {
    if (+a[key] === +b[key]) {
      return 0;
    }

    return +a[key] < +b[key] ? -1 : 1;
  };
}

function sortChange(a: FundProcessed, b: FundProcessed): number {
  if (a.change.dailyReturn === b.change.dailyReturn) {
    return 0;
  }

  return a.change.dailyReturn < b.change.dailyReturn ? -1 : 1;
}

const sortChoice = {
  name: createSortString('name'),
  inception: createSortString('inception'),
  aumEth: createSortNumberFromString('aumEth'),
  sharePrice: createSortNumberFromString('sharePrice'),
  change: sortChange,
  shares: createSortNumberFromString('shares'),
  denomination: createSortString('denomination'),
  investments: createSortString('investments'),
  version: createSortString('version'),
  status: createSortString('status'),
};

const useFilteredFunds = (funds: FundProcessed[]) => {
  const [search, setSearch] = useState('');

  const filteredFunds = useMemo(() => {
    return funds && funds.filter(({ name }) => name.toLowerCase().includes(search));
  }, [funds, search]);

  return {
    search,
    setSearch,
    funds: filteredFunds,
  };
};

const useSortedFunds = (filteredFunds: FundProcessed[]) => {
  const [item, setItem] = useState<SortChoice>({
    key: 'sharePrice',
    order: 'desc',
  });

  const sortedFunds = useMemo(() => {
    if (!filteredFunds) {
      return [];
    }

    const sortedValues = filteredFunds.slice().sort(sortChoice[item.key]);

    return item.order === 'asc' ? sortedValues : sortedValues.reverse();
  }, [filteredFunds, item]);

  return {
    item,
    setItem,
    funds: sortedFunds,
  };
};

const tableHeadings = [
  {
    value: 'Name',
    key: 'name',
  },
  {
    value: 'Address',
  },
  {
    value: 'Inception',
    key: 'inception',
  },
  {
    value: 'AUM [ETH]',
    key: 'aumEth',
  },
  {
    value: 'Share price',
    key: 'sharePrice',
  },
  {
    value: 'Change',
    key: 'change',
  },
  {
    value: '# shares',
    key: 'shares',
  },
  {
    value: 'Denomination',
    key: 'denomination',
  },
  {
    value: 'Investments',
    key: 'investments',
  },
  {
    value: 'Protocol',
    key: 'version',
  },
  {
    value: 'Status',
    key: 'status',
  },
];

export const FundOverview: React.FC = () => {
  const history = useHistory();
  const [funds, query] = useFundOverviewQuery();

  const filtered = useFilteredFunds(funds);
  const sorted = useSortedFunds(filtered.funds);
  const pagination = usePagination(sorted.funds);

  if (query.loading) {
    return <Spinner positioning="centered" size="large" />;
  }

  if (!funds) {
    return <NoMatch />;
  }

  const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    filtered.setSearch(value.toLowerCase());
    pagination.setOffset(0);
  };

  const handleChangeSortableItem = (key: any) => {
    if (key === sorted.item.key) {
      return sorted.setItem({
        key,
        order: sorted.item.order === 'asc' ? 'desc' : 'asc',
      });
    }

    return sorted.setItem({
      key,
      order: 'asc',
    });
  };

  return (
    <S.Container>
      <S.InputSearchBar
        value={filtered.search}
        onChange={handleChange}
        type="text"
        className="input"
        placeholder="Search..."
      />
      <S.Table>
        <thead>
          <S.HeaderRow>
            {tableHeadings.map((heading, key) => (
              <S.HeaderCell key={key} onClick={heading.key ? () => handleChangeSortableItem(heading.key) : undefined}>
                {heading.value}
              </S.HeaderCell>
            ))}
          </S.HeaderRow>
        </thead>
        <tbody>
          {pagination.data.length ? (
            pagination.data.map(fund => (
              <S.BodyRow key={fund.id} onClick={() => history.push(`/fund/${fund.id}`)}>
                <S.BodyCell>{fund.name}</S.BodyCell>
                <S.BodyCell>{fund.address}...</S.BodyCell>
                <S.BodyCell>{fund.inception}</S.BodyCell>
                <S.BodyCell>{fund.aumEth}</S.BodyCell>
                <S.BodyCell>{fund.sharePrice}</S.BodyCell>
                <S.BodyCell>
                  <FundOverviewChange
                    prefix={fund.change.prefix}
                    dailyReturn={fund.change.dailyReturn}
                    color={fund.change.color}
                  />
                </S.BodyCell>
                <S.BodyCell>{fund.shares}</S.BodyCell>
                <S.BodyCell>{fund.denomination}</S.BodyCell>
                <S.BodyCell>{fund.investments}</S.BodyCell>
                <S.BodyCell>{fund.version}</S.BodyCell>
                <S.BodyCell>{fund.status}</S.BodyCell>
              </S.BodyRow>
            ))
          ) : (
            <S.EmptyRow>
              <S.EmptyCell colSpan={12}>No records to display</S.EmptyCell>
            </S.EmptyRow>
          )}
        </tbody>
      </S.Table>
      <Pagination
        hasPrevious={pagination.offset <= 0}
        hasNext={pagination.offset + 20 >= filtered.funds.length}
        previous={() => pagination.setOffset(pagination.offset - 20)}
        next={() => pagination.setOffset(pagination.offset + 20)}
        actual={pagination.offset}
        totalItems={filtered.funds.length}
      />
    </S.Container>
  );
};
