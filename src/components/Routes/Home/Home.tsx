import React, { useState, useMemo, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { NoMatch } from '~/components/Routes/NoMatch/NoMatch';
import { FundOverviewPagination } from '~/components/Routes/Home/FundOverviewPagination/FundOverviewPagination';
import { useFundOverviewQuery, FundProcessed } from '~/queries/FundOverview';
import { usePagination } from '~/hooks/usePagination';
import { useAccount } from '~/hooks/useAccount';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { Block, BlockActions } from '~/storybook/components/Block/Block';
import { Input } from '~/storybook/components/Input/Input';
import { FormField } from '~/storybook/components/FormField/FormField';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Button } from '~/storybook/components/Button/Button';
import * as S from './Home.styles';
import { Container } from '~/storybook/components/Container/Container';
import { FormattedDate } from '~/components/Common/FormattedDate/FormattedDate';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';

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
  if (a.change === b.change) {
    return 0;
  }

  return a.change < b.change ? -1 : 1;
}

const sortChoice = {
  name: createSortString('name'),
  inception: createSortString('inception'),
  aumEth: createSortNumberFromString('aumEth'),
  aumUsd: createSortNumberFromString('aumEth'),
  sharePrice: createSortNumberFromString('sharePrice'),
  change: sortChange,
  shares: createSortNumberFromString('shares'),
  denomination: createSortString('denomination'),
  investments: createSortString('investments'),
  version: createSortString('version'),
  status: createSortString('status'),
};

const useFilteredFunds = (funds: FundProcessed[], search: string) => {
  const filteredFunds = useMemo(() => {
    if (!funds || !search) {
      return funds;
    }

    return funds.filter(({ name }) => name.toLowerCase().includes(search));
  }, [funds, search]);

  return {
    search,
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
    align: 'left',
  },
  {
    value: 'Inception',
    key: 'inception',
    align: 'left',
  },
  {
    value: 'Share price',
    key: 'sharePrice',
    align: 'right',
  },
  {
    value: 'Daily change',
    key: 'change',
    align: 'right',
  },
  {
    value: 'AUM [ETH]',
    key: 'aumEth',
    align: 'right',
  },
  {
    value: 'AUM [USD]',
    key: 'aumUsd',
    align: 'right',
  },
  {
    value: '# shares',
    key: 'shares',
    align: 'right',
  },
  {
    value: 'Denomination asset',
    key: 'denomination',
    align: 'left',
  },
  {
    value: 'Investments',
    key: 'investments',
    align: 'right',
  },
  {
    value: 'Protocol version',
    key: 'version',
    align: 'left',
  },
  {
    value: 'Status',
    key: 'status',
    align: 'left',
  },
];

export const Home: React.FC = () => {
  const history = useHistory();
  const [funds, query] = useFundOverviewQuery();
  const [search, setSearch] = useState('');

  const filtered = useFilteredFunds(funds, search);
  const sorted = useSortedFunds(filtered.funds);
  const pagination = usePagination(sorted.funds);
  const account = useAccount();

  useEffect(() => {
    pagination.setOffset(0);
  }, [search]);

  if (query.loading) {
    return (
      <Container>
        <Grid>
          <GridRow>
            <GridCol>
              <Block>
                <Spinner />
              </Block>
            </GridCol>
          </GridRow>
        </Grid>
      </Container>
    );
  }

  if (!funds) {
    return (
      <Container>
        <Grid>
          <GridRow>
            <GridCol>
              <Block>
                <NoMatch />
                {!account.fund && (
                  <BlockActions>
                    <Link to="/wallet/setup">
                      <Button>Create your own Melon fund</Button>
                    </Link>
                  </BlockActions>
                )}
              </Block>
            </GridCol>
          </GridRow>
        </Grid>
      </Container>
    );
  }

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
    <Container>
      <Grid>
        <GridRow>
          <GridCol>
            <Block>
              <SectionTitle>Melon fund universe</SectionTitle>
              <FormField label="Search">
                <Input id="search" name="search" type="text" onChange={event => setSearch(event.target.value)} />
              </FormField>
              <FundOverviewPagination
                offset={pagination.offset}
                setOffset={pagination.setOffset}
                funds={filtered.funds.length}
              />

              <S.ScrollableTable>
                <S.Table>
                  <thead>
                    <S.HeaderRow>
                      {tableHeadings.map((heading, key) =>
                        heading.align === 'left' ? (
                          <S.HeaderCell
                            key={key}
                            onClick={heading.key ? () => handleChangeSortableItem(heading.key) : undefined}
                          >
                            {heading.value}
                            {sorted.item.key === heading.key &&
                              (sorted.item.order === 'asc' ? <>&uarr;</> : <>&darr;</>)}
                          </S.HeaderCell>
                        ) : (
                          <S.HeaderCellNumber
                            key={key}
                            onClick={heading.key ? () => handleChangeSortableItem(heading.key) : undefined}
                          >
                            {heading.value}
                            {sorted.item.key === heading.key &&
                              (sorted.item.order === 'asc' ? <>&uarr;</> : <>&darr;</>)}
                          </S.HeaderCellNumber>
                        )
                      )}
                    </S.HeaderRow>
                  </thead>
                  <tbody>
                    {pagination.data.length ? (
                      pagination.data.map(fund => (
                        <S.BodyRow key={fund.id} onClick={() => history.push(`/fund/${fund.id}`)}>
                          <S.BodyCell>{fund.name}</S.BodyCell>
                          <S.BodyCell>
                            <FormattedDate timestamp={fund.inception} />
                          </S.BodyCell>
                          <S.BodyCellNumber>{fund.sharePrice}</S.BodyCellNumber>
                          <S.BodyCellNumber>
                            <FormattedNumber value={fund.change} colorize={true} decimals={2} suffix="%" />
                          </S.BodyCellNumber>
                          <S.BodyCellNumber>{fund.aumEth}</S.BodyCellNumber>
                          <S.BodyCellNumber>{fund.aumUsd || ''}</S.BodyCellNumber>
                          <S.BodyCellNumber>{fund.shares}</S.BodyCellNumber>
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
              </S.ScrollableTable>
              <FundOverviewPagination
                offset={pagination.offset}
                setOffset={pagination.setOffset}
                funds={filtered.funds.length}
              />
              {!account.fund && (
                <BlockActions>
                  <Link to="/wallet/setup">
                    <Button>Create your own Melon fund</Button>
                  </Link>
                </BlockActions>
              )}
            </Block>
          </GridCol>
        </GridRow>
      </Grid>
    </Container>
  );
};

export default Home;
