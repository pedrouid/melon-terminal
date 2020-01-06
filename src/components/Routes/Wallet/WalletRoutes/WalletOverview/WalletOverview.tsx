import React from 'react';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import * as S from './WalletOverview.styles';
import { useFundParticipationOverviewQuery } from '~/queries/FundParticipationOverview';
import { WalletOverviewInvestmentRequest } from './WalletOverviewInvestmentRequest/WalletOverviewInvestmentRequest';
import { WalletOverviewManagedFund } from './WalletOverviewManagedFund/WalletOverviewManagedFund';
import { WalletOverviewInvestedFund } from './WalletOverviewInvestedFund/WalletOverviewInvestedFund';
import { useAccount } from '~/hooks/useAccount';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { GridRow, Grid, GridCol } from '~/storybook/components/Grid/Grid';

const fundHeadings = ['Name', 'Inception', 'AUM [ETH]', 'Share price', 'Change', '# shares', 'Version', 'Status'];
const redeemHeadings = ['Name', 'Inception', 'AUM [ETH]', 'Share price', 'Change', '# shares', 'Version', 'Status'];
const requestHeadings = ['Fund name', 'Request date', 'Request asset', 'Request amount', 'Requested shares'];

export const WalletOverview: React.FC = () => {
  const account = useAccount();
  const [invested, requests, managed, query] = useFundParticipationOverviewQuery(account.address);

  if (query.loading) {
    return <Spinner positioning="centered" size="large" />;
  }

  const managedHeader = fundHeadings.map((heading, index) => <S.HeaderCell key={index}>{heading}</S.HeaderCell>);
  const managedEmpty = !(managed && managed.length);
  const managedRows = !managedEmpty ? (
    managed.map(fund => <WalletOverviewManagedFund {...fund} key={fund.address} />)
  ) : (
    <S.EmptyRow>
      <S.EmptyCell colSpan={12}>You do not manage any funds.</S.EmptyCell>
    </S.EmptyRow>
  );

  const investedHeader = redeemHeadings.map((heading, index) => <S.HeaderCell key={index}>{heading}</S.HeaderCell>);
  const investedEmpty = !(invested && invested.length);
  const investedRows = !investedEmpty ? (
    invested.map(fund => <WalletOverviewInvestedFund {...fund} key={fund.address} />)
  ) : (
    <S.EmptyRow>
      <S.EmptyCell colSpan={12}>You don't own any shares in any funds.</S.EmptyCell>
    </S.EmptyRow>
  );

  const requestsHeader = requestHeadings.map((heading, index) => <S.HeaderCell key={index}>{heading}</S.HeaderCell>);
  const requestsEmpty = !(requests && requests.length);
  const requestsRows = !requestsEmpty ? (
    requests.map(request => <WalletOverviewInvestmentRequest {...request} key={request.address} />)
  ) : (
    <S.EmptyRow>
      <S.EmptyCell colSpan={12}>You do not have any pending investment requests.</S.EmptyCell>
    </S.EmptyRow>
  );

  return (
    <Grid>
      <GridRow>
        <GridCol xs={12} sm={6}>
          <SectionTitle>Managed funds</SectionTitle>
          <Block>
            <S.Table>
              <thead>
                <S.HeaderRow>{managedHeader}</S.HeaderRow>
              </thead>
              <tbody>{managedRows}</tbody>
            </S.Table>
          </Block>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol xs={12} sm={6}>
          <SectionTitle>Funds with owned shares</SectionTitle>
          <Block>
            <S.Table>
              <thead>
                <S.HeaderRow>{investedHeader}</S.HeaderRow>
              </thead>
              <tbody>{investedRows}</tbody>
            </S.Table>
          </Block>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol xs={12} sm={6}>
          <SectionTitle>Pending investment requests</SectionTitle>
          <Block>
            <S.Table>
              <thead>
                <S.HeaderRow>{requestsHeader}</S.HeaderRow>
              </thead>
              <tbody>{requestsRows}</tbody>
            </S.Table>
          </Block>
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export default WalletOverview;
