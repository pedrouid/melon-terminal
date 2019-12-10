import React, { FormEvent } from 'react';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import * as S from './FundOverview.styles';
import { useFundParticipationOverviewQuery, Fund } from '~/queries/FundParticipationOverview';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useFundParticipationQuery } from '~/queries/FundParticipation';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { useTransaction } from '~/hooks/useTransaction';
import { Version, Participation } from '@melonproject/melonjs';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { NetworkStatus } from 'apollo-client';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';

const headings = [
  'Name',
  'Inception',
  'Version',
  'Address',
  'Share price',
  'Total supply',
  'Your shares',
  'Status',
  'Action',
];

const FundOverviewInvestedFund: React.FC<Fund> = props => {
  const [result, query] = useFundParticipationQuery(props.address);
  const link = useEtherscanLink({ address: props.address })!;
  const loading = query.networkStatus < NetworkStatus.ready && <Spinner size="tiny" positioning="left" />;

  const shutdown = result && result.shutdown;
  const supply = result && result.supply;
  const balance = result && result.balance;

  const environment = useEnvironment()!;
  const participationContract = new Participation(environment, props.participationAddress);

  const transaction = useTransaction(environment, {
    onFinish: () => query.refetch(),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const tx = participationContract.redeem(environment.account!);
    transaction.start(tx);
  };

  return (
    <S.BodyRow>
      <S.BodyCell>{props.name}</S.BodyCell>
      <S.BodyCell>{props.inception}</S.BodyCell>
      <S.BodyCell>{props.version}</S.BodyCell>
      <S.BodyCell>
        <a href={link}>{props.address}</a>
      </S.BodyCell>
      <S.BodyCell>{props.sharePrice}</S.BodyCell>
      <S.BodyCell>
        {loading && <Spinner size="tiny" positioning="left" />}
        {!loading && supply && supply.toFixed(4)}
      </S.BodyCell>
      <S.BodyCell>
        {loading && <Spinner size="tiny" positioning="left" />}
        {!loading && balance && balance.toFixed(4)}
      </S.BodyCell>
      <S.BodyCell>
        {loading && <Spinner size="tiny" positioning="left" />}
        {!loading && (shutdown ? 'Inactive' : 'Active')}
      </S.BodyCell>
      <S.BodyCell>
        {loading && <Spinner size="tiny" positioning="left" />}
        {!loading && balance && !balance.isZero() && (
          <form onSubmit={submit}>
            <SubmitButton label="Redeem" />
          </form>
        )}
        {!loading && balance && balance.isZero() && 'Already redeemed'}
      </S.BodyCell>
      <TransactionModal transaction={transaction} title="Redeem shares" />
    </S.BodyRow>
  );
};

const FundOverviewManagedFund: React.FC<Fund> = props => {
  const [result, query] = useFundParticipationQuery(props.address);
  const link = useEtherscanLink({ address: props.address })!;
  const loading = query.networkStatus < NetworkStatus.ready;

  const shutdown = result && result.shutdown;
  const supply = result && result.supply;
  const balance = result && result.balance;

  const environment = useEnvironment()!;
  const version = new Version(environment, props.versionAddress);

  const transaction = useTransaction(environment, {
    onFinish: () => query.refetch(),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const tx = version.shutDownFund(environment.account!, props.address);
    transaction.start(tx);
  };

  return (
    <S.BodyRow>
      <S.BodyCell>{props.name}</S.BodyCell>
      <S.BodyCell>{props.inception}</S.BodyCell>
      <S.BodyCell>{props.version}</S.BodyCell>
      <S.BodyCell>
        <a href={link}>{props.address}</a>
      </S.BodyCell>
      <S.BodyCell>{props.sharePrice}</S.BodyCell>
      <S.BodyCell>
        {loading && <Spinner size="tiny" positioning="left" />}
        {!loading && supply && supply.toFixed(4)}
      </S.BodyCell>
      <S.BodyCell>
        {loading && <Spinner size="tiny" positioning="left" />}
        {!loading && balance && balance.toFixed(4)}
      </S.BodyCell>
      <S.BodyCell>
        {loading && <Spinner size="tiny" positioning="left" />}
        {!loading && (shutdown ? 'Inactive' : 'Active')}
      </S.BodyCell>
      <S.BodyCell>
        {loading && <Spinner size="tiny" positioning="left" />}
        {!loading && !shutdown && (
          <form onSubmit={submit}>
            <SubmitButton label="Shutdown" />
          </form>
        )}
        {!loading && shutdown && 'Already shut down'}
      </S.BodyCell>
      <TransactionModal transaction={transaction} title="Shutdown fund" />
    </S.BodyRow>
  );
};

export const FundOverview: React.FC = () => {
  const environment = useEnvironment()!;
  const [invested, managed, query] = useFundParticipationOverviewQuery(environment.account);

  if (query.loading) {
    return <Spinner positioning="centered" size="large" />;
  }

  const header = headings.map((heading, index) => <S.HeaderCell key={index}>{heading}</S.HeaderCell>);

  const managedEmpty = !(managed && managed.length);
  const managedRows = !managedEmpty ? (
    managed.map(fund => <FundOverviewManagedFund {...fund} key={fund.address} />)
  ) : (
    <S.EmptyRow>
      <S.EmptyCell colSpan={12}>You do not manage any funds.</S.EmptyCell>
    </S.EmptyRow>
  );

  const investedEmpty = !(invested && invested.length);
  const investedRows = !investedEmpty ? (
    invested.map(fund => <FundOverviewInvestedFund {...fund} key={fund.address} />)
  ) : (
    <S.EmptyRow>
      <S.EmptyCell colSpan={12}>You don't own any shares in any funds.</S.EmptyCell>
    </S.EmptyRow>
  );

  return (
    <S.Container>
      <S.Group>
        <S.Title>Managed funds</S.Title>
        {!managedEmpty && (
          <p>
            Shutting down your fund closes the fund for new investors and trades will no longer be possible. Investor
            can redeem their shares whenever they want.
          </p>
        )}
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
        {!investedEmpty && (
          <p>Redeeming shares will transfer the full amount of your investment back to your wallet.</p>
        )}
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
