import React from 'react';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { useFundParticipationOverviewQuery } from '~/queries/FundParticipationOverview';
import { WalletOverviewInvestmentRequest } from './WalletOverviewInvestmentRequest/WalletOverviewInvestmentRequest';
import { WalletOverviewManagedFund } from './WalletOverviewManagedFund/WalletOverviewManagedFund';
import { WalletOverviewInvestedFund } from './WalletOverviewInvestedFund/WalletOverviewInvestedFund';
import { WalletOverviewAccountBalance } from './WalletOverviewAccountBalance/WalletOverviewAccountBalance';
import { useAccount } from '~/hooks/useAccount';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { GridRow, Grid, GridCol } from '~/storybook/components/Grid/Grid';
import { BodyRow, BodyCell, HeaderCell, Table, HeaderRow } from '~/storybook/components/Table/Table';

const fundHeadings = ['Name', 'Inception', 'AUM [ETH]', 'Share price', 'Change', '# shares', 'Version', 'Status'];
const redeemHeadings = ['Name', 'Inception', 'AUM [ETH]', 'Share price', 'Change', '# shares', 'Version', 'Status'];
const requestHeadings = ['Fund name', 'Request date', 'Request asset', 'Request amount', 'Requested shares'];

export const WalletOverview: React.FC = () => {
  const account = useAccount();
  const [invested, requests, managed, query] = useFundParticipationOverviewQuery(account.address);
  const managedHeader = fundHeadings.map((heading, index) => <HeaderCell key={index}>{heading}</HeaderCell>);
  const managedEmpty = !(managed && managed.length);
  const managedRows = !managedEmpty ? (
    managed.map(fund => <WalletOverviewManagedFund {...fund} key={fund.address} />)
  ) : (
    <BodyRow>
      <BodyCell colSpan={12}>You do not manage any funds.</BodyCell>
    </BodyRow>
  );

  const investedHeader = redeemHeadings.map((heading, index) => <HeaderCell key={index}>{heading}</HeaderCell>);
  const investedEmpty = !(invested && invested.length);
  const investedRows = !investedEmpty ? (
    invested.map(fund => <WalletOverviewInvestedFund {...fund} key={fund.address} />)
  ) : (
    <BodyRow>
      <BodyCell colSpan={12}>You don't own any shares in any funds.</BodyCell>
    </BodyRow>
  );

  const requestsHeader = requestHeadings.map((heading, index) => <HeaderCell key={index}>{heading}</HeaderCell>);
  const requestsEmpty = !(requests && requests.length);
  const requestsRows = !requestsEmpty ? (
    requests.map(request => <WalletOverviewInvestmentRequest {...request} key={request.address} />)
  ) : (
    <BodyRow>
      <BodyCell colSpan={12}>You do not have any pending investment requests.</BodyCell>
    </BodyRow>
  );

  return (
    <Grid>
      <GridRow>
        <GridCol xs={12} sm={12}>
          <Block>
            <SectionTitle>Managed funds</SectionTitle>
            {query.loading && <Spinner />}

            {!query.loading && (
              <Table>
                <thead>
                  <HeaderRow>{managedHeader}</HeaderRow>
                </thead>
                <tbody>{managedRows}</tbody>
              </Table>
            )}
          </Block>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol xs={12} sm={12}>
          <Block>
            <SectionTitle>Funds with owned shares</SectionTitle>
            {query.loading && <Spinner />}

            {!query.loading && (
              <Table>
                <thead>
                  <HeaderRow>{investedHeader}</HeaderRow>
                </thead>
                <tbody>{investedRows}</tbody>
              </Table>
            )}
          </Block>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol xs={12} sm={12}>
          <Block>
            <SectionTitle>Pending investment requests</SectionTitle>
            {query.loading && <Spinner />}

            {!query.loading && (
              <Table>
                <thead>
                  <HeaderRow>{requestsHeader}</HeaderRow>
                </thead>
                <tbody>{requestsRows}</tbody>
              </Table>
            )}
          </Block>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol xs={12} sm={12}>
          <WalletOverviewAccountBalance account={account.address} />
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export default WalletOverview;
