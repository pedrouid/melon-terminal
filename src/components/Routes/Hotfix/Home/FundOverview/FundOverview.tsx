import React from 'react';
import { useHistory } from 'react-router';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import * as S from './FundOverview.styles';
import { useFundParticipationOverviewQuery } from '~/queries/FundParticipationOverview';
import { useEnvironment } from '~/hooks/useEnvironment';

const headings = ['Name', 'Inception', 'Your shares', 'Total supply', 'Share price', 'Version', 'Status'];

export const FundOverview: React.FC = () => {
  const history = useHistory();
  const environment = useEnvironment()!;
  const [invested, managed, query] = useFundParticipationOverviewQuery(environment.account);

  if (query.loading) {
    return <Spinner positioning="centered" size="large" />;
  }

  const header = headings.map((heading, index) => <S.HeaderCell key={index}>{heading}</S.HeaderCell>);

  const managedEmpty = !(managed && managed.length);
  const managedRows = !managedEmpty ? (
    managed.map(fund => (
      <S.BodyRow key={fund.address} onClick={() => history.push(`/fund/${fund.address}`)}>
        <S.BodyCell>{fund.name}</S.BodyCell>
        <S.BodyCell>{fund.inception}</S.BodyCell>
        <S.BodyCell>{fund.shares}</S.BodyCell>
        <S.BodyCell>{fund.totalSupply}</S.BodyCell>
        <S.BodyCell>{fund.sharePrice}</S.BodyCell>
        <S.BodyCell>{fund.version}</S.BodyCell>
        <S.BodyCell>{fund.status}</S.BodyCell>
      </S.BodyRow>
    ))
  ) : (
    <S.EmptyRow>
      <S.EmptyCell colSpan={12}>You do not manage any funds.</S.EmptyCell>
    </S.EmptyRow>
  );

  const investedEmpty = !(invested && invested.length);
  const investedRows = !investedEmpty ? (
    invested.map(fund => (
      <S.BodyRow key={fund.address} onClick={() => history.push(`/fund/${fund.address}`)}>
        <S.BodyCell>{fund.name}</S.BodyCell>
        <S.BodyCell>{fund.inception}</S.BodyCell>
        <S.BodyCell>{fund.shares}</S.BodyCell>
        <S.BodyCell>{fund.totalSupply}</S.BodyCell>
        <S.BodyCell>{fund.sharePrice}</S.BodyCell>
        <S.BodyCell>{fund.version}</S.BodyCell>
        <S.BodyCell>{fund.status}</S.BodyCell>
      </S.BodyRow>
    ))
  ) : (
    <S.EmptyRow>
      <S.EmptyCell colSpan={12}>You don't own any shares in any funds.</S.EmptyCell>
    </S.EmptyRow>
  );

  return (
    <S.Container>
      <S.Group>
        <S.Title>Managed funds</S.Title>
        <S.ScrollableTable>
          <S.Table>
            <thead>
              <S.HeaderRow>{header}</S.HeaderRow>
            </thead>
            <tbody>{managedRows}</tbody>
          </S.Table>
        </S.ScrollableTable>
      </S.Group>
      <S.Group>
        <S.Title>Funds with owned shares</S.Title>
        <S.ScrollableTable>
          <S.Table>
            <thead>
              <S.HeaderRow>{header}</S.HeaderRow>
            </thead>
            <tbody>{investedRows}</tbody>
          </S.Table>
        </S.ScrollableTable>
      </S.Group>
    </S.Container>
  );
};
