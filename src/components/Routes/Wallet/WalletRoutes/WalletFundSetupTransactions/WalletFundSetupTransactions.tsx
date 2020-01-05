import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { ButtonBlock } from '~/components/Common/Form/ButtonBlock/ButtonBlock';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionReceipt } from 'web3-core';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Transaction } from '@melonproject/melonjs';
import { useAccountFundQuery } from '~/queries/AccountFund';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { NoMatch } from '~/components/Routes/NoMatch/NoMatch';
import { useHistory } from 'react-router';
import { NetworkStatus } from 'apollo-client';
import { versionContract } from '~/utils/deploymentContracts';
import { useAccount } from '~/hooks/useAccount';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';

interface TransactionPipelineItem {
  previous: string;
  name?: string;
  next?: string;
  transaction?: () => Transaction<TransactionReceipt>;
}

interface TransactionPipeline {
  [key: string]: TransactionPipelineItem;
}

export const WalletFundSetupTransactions: React.FC = props => {
  const [result, query] = useAccountFundQuery();
  const environment = useEnvironment()!;
  const account = useAccount();
  const history = useHistory();

  // TODO: This should use the version contract address of the fund that is being created.
  const factory = useMemo(() => versionContract(environment), [environment]);
  const pipeline: TransactionPipeline = useMemo(
    () => ({
      BEGIN: {
        name: 'Create Accounting Contract',
        previous: 'The main fund contract has been created.',
        next: 'We are now going to create the Accounting Contract (responsible for calculating share price, NAV, etc.)',
        transaction: () => factory.createAccounting(account.address!),
      },
      ACCOUNTING: {
        name: 'Create Fee Manager Contract',
        previous: 'The Accounting Contract has been created.',
        next: 'We are now going to create the Fee Manager contract (responsible for calculating fees)',
        transaction: () => factory.createFeeManager(account.address!),
      },
      FEE_MANAGER: {
        name: 'Create Participation Contract',
        previous: 'The Fee Manager Contract has been created.',
        next:
          'We are now going to create the Participation Contract (responsible for allowing investors into the fund)',
        transaction: () => factory.createParticipation(account.address!),
      },
      PARTICIPATION: {
        name: 'Create Policy Manager Contract',
        previous: 'The Participation Contract has been created.',
        next:
          'We are now going to create the Policy Manager Contract (responsible for managing risk management and compliance policies)',
        transaction: () => factory.createPolicyManager(account.address!),
      },
      POLICY_MANAGER: {
        previous: 'The Policy Manager Contract has been created.',
        name: 'Create Shares Contract',
        next: 'We are now going to create the Shares Contract (responsible for creating fund shares)',
        transaction: () => factory.createShares(account.address!),
      },
      SHARES: {
        previous: 'The Shares Contract has been created.',
        name: 'Create Trading Contract',
        next: 'We are now going to create the Trading Contract (responsible for all trading activities of the fund)',
        transaction: () => factory.createTrading(account.address!),
      },
      TRADING: {
        previous: 'The Trading Contract has been created.',
        name: 'Create Vault Contract',
        next: 'We are now going to create the Vault Contract (responsible for securely storing all assets)',
        transaction: () => factory.createVault(account.address!),
      },
      VAULT: {
        previous: 'The Vault Contract has been created.',
        name: 'Complete Setup',
        next: 'We are now going to complete the fund setup (setting permissions, etc.)',
        transaction: () => factory.completeSetup(account.address!),
      },
      COMPLETE: {
        previous: 'The fund setup has been completed.',
        transaction: () => factory.completeSetup(account.address!),
      },
    }),
    [factory, environment]
  );

  const fund = result ? result.fund : undefined;
  const progress = fund ? fund.progress : undefined;
  const step = progress ? (pipeline[progress] as TransactionPipelineItem) : undefined;
  const next = useMemo(() => step && step.transaction && step.transaction(), [step]);

  const [acknowledged, setAcknowledged] = useState(!!(history.location.state && history.location.state.start));
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment, {
    onStart: () => setAcknowledged(false),
    onFinish: () => refetch(),
    onAcknowledge: () => setAcknowledged(true),
  });

  useEffect(() => {
    if (acknowledged && progress === 'COMPLETE') {
      return history.push(`/fund/${fund!.address}`);
    }

    if (acknowledged && next) {
      return transaction.start(next, step!.name!);
    }
  }, [progress, next, acknowledged]);

  if (query.networkStatus < NetworkStatus.ready) {
    return <Spinner />;
  }

  if (!step) {
    return <NoMatch />;
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    next && transaction.start(next, step!.name!);
  };

  return (
    <>
      {step.previous && <p>{step.previous}</p>}
      {step.next && <p>{step.next}</p>}
      {step.next && (
        <form onSubmit={submit}>
          <ButtonBlock>
            <SubmitButton label={step.name!} />
          </ButtonBlock>
        </form>
      )}

      <TransactionModal transaction={transaction} />
    </>
  );
};

export default WalletFundSetupTransactions;
