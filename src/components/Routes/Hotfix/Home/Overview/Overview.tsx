import React, { FormEvent, useState, useEffect, useMemo } from 'react';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import * as S from './Overview.styles';
import { useFundParticipationOverviewQuery, Fund, InvestmentRequest } from '~/queries/FundParticipationOverview';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useFundParticipationQuery } from '~/queries/FundParticipation';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { useTransaction } from '~/hooks/useTransaction';
import { Version, Participation, Trading } from '@melonproject/melonjs';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { NetworkStatus } from 'apollo-client';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { refetchQueries } from '~/utils/refetchQueries';
import { useOnChainClient } from '~/hooks/useQuery';

const fundHeadings = ['Name', 'Address', 'Inception', 'Version', 'Status', 'Action'];
const redeemHeadings = ['Name', 'Address', 'Share price', 'Your shares', 'Action'];
const requestHeadings = [
  'Fund name',
  'Address',
  'Request date',
  'Request asset',
  'Request amount',
  'Requested shares',
  'Action',
];

const OverviewInvestmentRequest: React.FC<InvestmentRequest> = props => {
  const [result, query] = useFundParticipationQuery(props.address);
  const loading = query.networkStatus < NetworkStatus.ready;
  const client = useOnChainClient();

  const link = useEtherscanLink({ address: props.address })!;
  const cancelable = result.cancelable;
  const environment = useEnvironment()!;
  const participationContract = new Participation(environment, props.participationAddress);

  const transaction = useTransaction(environment, {
    onFinish: () => refetchQueries(client),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const tx = participationContract.cancelRequest(environment.account!);
    transaction.start(tx, 'Cancel expired order');
  };

  return (
    <S.BodyRow>
      <S.BodyCell>{props.name}</S.BodyCell>
      <S.BodyCell>
        <a href={link}>{props.address}</a>
      </S.BodyCell>
      <S.BodyCell>{props.requestCreatedAt}</S.BodyCell>
      <S.BodyCell>{props.requestAsset}</S.BodyCell>
      <S.BodyCell>{props.requestAmount}</S.BodyCell>
      <S.BodyCell>{props.requestShares}</S.BodyCell>
      <S.BodyCell>
        {loading && <Spinner size="tiny" positioning="left" />}
        {!loading && cancelable && (
          <form onSubmit={submit}>
            <SubmitButton label="Cancel" />
          </form>
        )}
        {!loading && !cancelable && <S.Good>Already cancelled</S.Good>}
      </S.BodyCell>
      <TransactionModal transaction={transaction} />
    </S.BodyRow>
  );
};

const OverviewInvestedFund: React.FC<Fund> = props => {
  const environment = useEnvironment()!;
  const [result, query] = useFundParticipationQuery(props.address);
  const link = useEtherscanLink({ address: props.address })!;
  const loading = query.networkStatus < NetworkStatus.ready;
  const client = useOnChainClient();

  const manager = environment.account === props.manager;
  const shutdown = result.shutdown;
  const balance = result.balance;
  const locked = result.lockedAssets;
  const invested = balance && !balance.isZero();

  const [acknowledged, setAcknowledged] = useState(false);
  const transaction = useTransaction(environment, {
    onStart: () => setAcknowledged(false),
    onFinish: () => refetchQueries(client),
    onAcknowledge: () => setAcknowledged(true),
  });

  const action = useMemo(() => {
    if ((manager || shutdown) && locked) {
      return () => {
        const trading = new Trading(environment, props.tradingAddress);
        const tx = trading.returnBatchToVault(environment.account!, props.ownedAssets);
        transaction.start(tx, 'Return assets to vault');
      };
    }

    if (invested && !locked) {
      return () => {
        const participation = new Participation(environment, props.participationAddress);
        const tx = participation.redeem(environment.account!);
        transaction.start(tx, 'Redeem all shares');
      };
    }

    return undefined;
  }, [props.participationAddress, props.tradingAddress, manager, locked, invested, shutdown]);

  // Start the next transaction whenever the previous one is acknowledged.
  useEffect(() => {
    acknowledged && action && action();
  }, [action, acknowledged]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    action && action();
  };

  const label = useMemo(() => {
    if ((manager || shutdown) && invested && locked) {
      return <SubmitButton label="Redeem all shares" />;
    }

    if ((manager || shutdown) && locked) {
      return <SubmitButton label="Clean fund state" />;
    }

    if (invested && !locked) {
      return <SubmitButton label="Redeem all shares" />;
    }

    if (invested && locked) {
      return <SubmitButton label="Redeem all shares" disabled={true} />;
    }

    return <S.Good>Already redeemed</S.Good>;
  }, [manager, invested, locked]);

  const description = useMemo(() => {
    if (invested && locked && !manager) {
      return (
        <S.Description>
          Before you can redeem your shares, the fund manager needs to release the assets from Trading back into the
          Vault.
        </S.Description>
      );
    }

    return undefined;
  }, [manager, balance, locked]);

  return (
    <S.BodyRow>
      <S.BodyCell>{props.name}</S.BodyCell>
      <S.BodyCell>
        <a href={link}>{props.address}</a>
      </S.BodyCell>
      <S.BodyCell>{props.sharePrice}</S.BodyCell>
      <S.BodyCell>
        {loading && <Spinner size="tiny" positioning="left" />}
        {!loading && balance && balance.toFixed(8)}
      </S.BodyCell>
      <S.BodyCell>
        {loading && <Spinner size="tiny" positioning="left" />}
        {!loading && action && <form onSubmit={submit}>{label}</form>}
        {!loading && !action && label}
        {!loading && description}
      </S.BodyCell>
      <TransactionModal transaction={transaction} />
    </S.BodyRow>
  );
};

const OverviewManagedFund: React.FC<Fund> = props => {
  const [result, query] = useFundParticipationQuery(props.address);
  const link = useEtherscanLink({ address: props.address })!;
  const loading = query.networkStatus < NetworkStatus.ready;
  const client = useOnChainClient();

  const shutdown = result.shutdown;
  const environment = useEnvironment()!;
  const locked = result.lockedAssets;

  const [acknowledged, setAcknowledged] = useState(false);
  const transaction = useTransaction(environment, {
    onStart: () => setAcknowledged(false),
    onFinish: () => refetchQueries(client),
    onAcknowledge: () => setAcknowledged(true),
  });

  const action = useMemo(() => {
    if (locked) {
      return () => {
        const trading = new Trading(environment, props.tradingAddress);
        const tx = trading.returnBatchToVault(environment.account!, props.ownedAssets);
        transaction.start(tx, 'Return assets to vault');
      };
    }

    if (!shutdown) {
      return () => {
        const version = new Version(environment, props.versionAddress);
        const tx = version.shutDownFund(environment.account!, props.address);
        transaction.start(tx, 'Shutdown fund');
      };
    }

    return undefined;
  }, [props.versionAddress, props.tradingAddress, locked, shutdown]);

  // Start the next transaction whenever the previous one is acknowledged.
  useEffect(() => {
    acknowledged && action && action();
  }, [action, acknowledged]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    action && action();
  };

  const label = useMemo(() => {
    if (locked && !shutdown) {
      return <SubmitButton label="Shutdown" />;
    }

    if (locked && shutdown) {
      return <SubmitButton label="Clean fund state" />;
    }

    if (!shutdown && !locked) {
      return <SubmitButton label="Shutdown" />;
    }

    return <S.Good>Already shut down</S.Good>;
  }, [shutdown, locked]);

  return (
    <S.BodyRow>
      <S.BodyCell>{props.name}</S.BodyCell>
      <S.BodyCell>
        <a href={link}>{props.address}</a>
      </S.BodyCell>
      <S.BodyCell>{props.inception}</S.BodyCell>
      <S.BodyCell>{props.version}</S.BodyCell>
      <S.BodyCell>
        {loading && <Spinner size="tiny" positioning="left" />}
        {!loading && (shutdown ? 'Inactive' : 'Active')}
      </S.BodyCell>
      <S.BodyCell>
        {loading && <Spinner size="tiny" positioning="left" />}
        {!loading && action && <form onSubmit={submit}>{label}</form>}
        {!loading && !action && label}
      </S.BodyCell>
      <TransactionModal transaction={transaction} />
    </S.BodyRow>
  );
};

export const Overview: React.FC = () => {
  const environment = useEnvironment()!;
  const [invested, requests, managed, query] = useFundParticipationOverviewQuery(environment.account);

  if (query.loading) {
    return <Spinner positioning="centered" size="large" />;
  }

  const managedHeader = fundHeadings.map((heading, index) => <S.HeaderCell key={index}>{heading}</S.HeaderCell>);
  const managedEmpty = !(managed && managed.length);
  const managedRows = !managedEmpty ? (
    managed.map(fund => <OverviewManagedFund {...fund} key={fund.address} />)
  ) : (
    <S.EmptyRow>
      <S.EmptyCell colSpan={12}>You do not manage any funds.</S.EmptyCell>
    </S.EmptyRow>
  );

  const investedHeader = redeemHeadings.map((heading, index) => <S.HeaderCell key={index}>{heading}</S.HeaderCell>);
  const investedEmpty = !(invested && invested.length);
  const investedRows = !investedEmpty ? (
    invested.map(fund => <OverviewInvestedFund {...fund} key={fund.address} />)
  ) : (
    <S.EmptyRow>
      <S.EmptyCell colSpan={12}>You don't own any shares in any funds.</S.EmptyCell>
    </S.EmptyRow>
  );

  const requestsHeader = requestHeadings.map((heading, index) => <S.HeaderCell key={index}>{heading}</S.HeaderCell>);
  const requestsEmpty = !(requests && requests.length);
  const requestsRows = !requestsEmpty ? (
    requests.map(request => <OverviewInvestmentRequest {...request} key={request.address} />)
  ) : (
    <S.EmptyRow>
      <S.EmptyCell colSpan={12}>You do not have any pending investment requests.</S.EmptyCell>
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
              <S.HeaderRow>{managedHeader}</S.HeaderRow>
            </thead>
            <tbody>{managedRows}</tbody>
          </S.Table>
        </S.ScrollableTable>
      </S.Group>
      <S.Group>
        <S.Title>Funds with owned shares</S.Title>
        {!investedEmpty && (
          <p>Redeeming shares will transfer the underlying assets of your shares back to your wallet.</p>
        )}
        <S.ScrollableTable>
          <S.Table>
            <thead>
              <S.HeaderRow>{investedHeader}</S.HeaderRow>
            </thead>
            <tbody>{investedRows}</tbody>
          </S.Table>
        </S.ScrollableTable>
      </S.Group>
      <S.Group>
        <S.Title>Pending investment requests</S.Title>
        {!requestsEmpty && (
          <p>
            Cancelling pending investment requests will transfer the underlying assets of the investment request back to
            your wallet.
          </p>
        )}
        <S.ScrollableTable>
          <S.Table>
            <thead>
              <S.HeaderRow>{requestsHeader}</S.HeaderRow>
            </thead>
            <tbody>{requestsRows}</tbody>
          </S.Table>
        </S.ScrollableTable>
      </S.Group>
    </S.Container>
  );
};
