import React, { useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Transaction, sameAddress } from '@melonproject/melonjs';
import { useTransaction } from '~/hooks/useTransaction';
import { useFundInvestQuery } from './FundInvest.query';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { RequestInvestment } from '../RequestInvestment/RequestInvestment';
import { ExecuteRequest } from '../ExecuteRequest/ExecuteRequest';
import { CancelRequest } from '../CancelRequest/CancelRequest';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { RequiresFundCreatedAfter } from '~/components/Gates/RequiresFundCreatedAfter/RequiresFundCreatedAfter';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { usePriceFeedUpdateQuery } from '~/components/Layout/PriceFeedUpdate.query';
import { TokenValue } from '~/components/Common/TokenValue/TokenValue';

export interface FundInvestProps {
  address: string;
}

export interface TransactionRef {
  next: (start: (transaction: Transaction, name: string) => void) => void;
}

export const FundInvest: React.FC<FundInvestProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const [result, query] = useFundInvestQuery(address);
  const [priceUpdate] = usePriceFeedUpdateQuery();

  const oneDay = 24 * 60 * 60 * 1000;
  const nextUpdate = new Date((priceUpdate?.getTime() || 0) + oneDay);

  const transactionRef = useRef<TransactionRef>();

  const transaction = useTransaction(environment, {
    onAcknowledge: () => {
      if (transactionRef.current) {
        transactionRef.current.next(transaction.start);
      }
    },
    handleError: (error, validation) => {
      if (validation?.name === 'NoInvestmentRequestError') {
        return 'Your investment request was already successfully executed by someone else.';
      }
    },
  });

  const request = result?.account?.participation?.request;
  const twentyFourHoursAfterRequest = new Date((request?.timestamp?.getTime() || 0) + oneDay);
  const symbol = environment.tokens.find(token => sameAddress(token.address, request?.investmentAsset))?.symbol;

  const account = result?.account;
  const allowedAssets = result?.fund?.routes?.participation?.allowedAssets;
  const action = useMemo(() => {
    const canCancelRequest = result?.account?.participation?.canCancelRequest;
    if (canCancelRequest) {
      return 'cancel';
    }

    const investmentRequestState = result?.account?.participation?.investmentRequestState;
    if (investmentRequestState === 'VALID') {
      return 'execute';
    }

    if (investmentRequestState === 'WAITING') {
      return 'waiting';
    }

    if (investmentRequestState === 'NONE') {
      return 'invest';
    }
  }, [result]);

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Invest</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  const totalSupply = result?.fund?.routes?.shares?.totalSupply;
  const fallback = (
    <>
      The Melon Terminal does not support investments in funds which are running on deprecated versions of the Melon
      protocol.
    </>
  );

  return (
    <Block>
      <SectionTitle>Invest</SectionTitle>
      <RequiresFundCreatedAfter after={new Date('2019-12-19')} fallback={fallback}>
        {action === 'cancel' && (
          <CancelRequest
            address={address}
            account={account!}
            loading={query.networkStatus < 7}
            transaction={transaction}
          />
        )}
        {action === 'invest' && (
          <RequestInvestment
            ref={transactionRef}
            address={address}
            allowedAssets={allowedAssets}
            totalSupply={totalSupply}
            account={account!}
            loading={query.networkStatus < 7}
            transaction={transaction}
          />
        )}
        {action === 'execute' && (
          <ExecuteRequest
            ref={transactionRef}
            address={address}
            account={account!}
            loading={query.networkStatus < 7}
            totalSupply={totalSupply}
            transaction={transaction}
          />
        )}
        {action === 'waiting' && (
          <>
            <p>You have a pending investment request:</p>

            <p>
              Requested shares:&nbsp;&nbsp;<TokenValue value={request?.requestedShares}></TokenValue>
              <br />
              Investment amount: <TokenValue value={request?.investmentAmount}></TokenValue> {symbol}
              <br />
              Request date: {format(request?.timestamp || 0, 'yyyy-MM-dd hh:mm a')}
            </p>

            <p>Wait for the execution window to execute your investment request.</p>
            <p>
              Execution window start: {format(nextUpdate, 'yyyy-MM-dd hh:mm a')}
              <br />
              Execution window end:&nbsp;&nbsp;&nbsp;{format(twentyFourHoursAfterRequest, 'yyyy-MM-dd hh:mm a')}
            </p>
          </>
        )}
        <TransactionModal transaction={transaction} />
      </RequiresFundCreatedAfter>
    </Block>
  );
};
