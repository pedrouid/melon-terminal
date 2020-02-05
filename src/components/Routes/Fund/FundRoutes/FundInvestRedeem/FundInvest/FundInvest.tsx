import React, { useMemo, useRef } from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Transaction } from '@melonproject/melonjs';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { useTransaction, TransactionHookValues, TransactionFormValues } from '~/hooks/useTransaction';
import { useFundInvestQuery } from '~/queries/FundInvest';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { RequestInvestment } from './RequestInvestment/RequestInvestment';
import { ExecuteRequest } from './ExecuteRequest/ExecuteRequest';
import { CancelRequest } from './CancelRequest/CancelRequest';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { RequiresFundCreatedAfter } from '~/components/Gates/RequiresFundCreatedAfter/RequiresFundCreatedAfter';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';

export interface FundInvestProps {
  address: string;
}

export interface TransactionRef {
  next: (start: (transaction: Transaction, name: string) => void) => void;
}

export const FundInvest: React.FC<FundInvestProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const [result, query] = useFundInvestQuery(address);
  const refetch = useOnChainQueryRefetcher();

  const transactionRef = useRef<TransactionRef>();

  const transaction = useTransaction(environment, {
    onFinish: receipt => refetch(receipt.blockNumber),
    onAcknowledge: () => {
      if (transactionRef.current) {
        transactionRef.current.next(transaction.start);
      }
    },
  });
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
  const fallback = <>Investments in this fund have been disabled.</>;

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
          <p>
            You need to wait before you can execute your investment request. The time-window to execute your investment
            request is between the next price update and 24 hours after your investment request.
          </p>
        )}
        <TransactionModal transaction={transaction} />
      </RequiresFundCreatedAfter>
    </Block>
  );
};
