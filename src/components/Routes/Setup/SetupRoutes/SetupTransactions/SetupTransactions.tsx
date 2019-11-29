import React, { FormEvent } from 'react';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { ButtonBlock } from '~/components/Common/Form/ButtonBlock/ButtonBlock';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionReceipt } from 'web3-core';

import { useEnvironment } from '~/hooks/useEnvironment';
import { Version, Transaction } from '@melonproject/melonjs';
import { useAccountFundQuery } from '~/queries/AccountFund';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { NoMatch } from '~/components/Routes/NoMatch/NoMatch';
import { useHistory } from 'react-router';

export interface Transactions {
  [key: string]: {
    whatHappened: string;
    name: string;
    nextStep: string;
    tx: () => Transaction<TransactionReceipt>;
    step: number;
  };
}

export const SetupTransactions: React.FC = props => {
  const environment = useEnvironment()!;
  const [accountFund, query] = useAccountFundQuery();
  const history = useHistory();

  const transaction = useTransaction(environment, {
    onAcknowledge: () => query.refetch(),
  });

  if (query.loading) {
    return <Spinner />;
  }

  if (!accountFund) {
    return <NoMatch />;
  }

  const fund = accountFund && accountFund.fund;

  const address = environment.deployment.melonContracts.version;
  const factory = new Version(environment, address);

  const transactionPipeline: Transactions = {
    BEGIN: {
      whatHappened: 'The main fund contract has been created.',
      name: 'Create Accounting Contract',
      nextStep:
        'We are now going to create the Accounting Contract (responsible for calculating share price, NAV, etc.)',
      tx: () => factory.createAccounting(environment.account!),
      step: 1,
    },
    ACCOUNTING: {
      whatHappened: 'The Accounting Contract has been created.',
      name: 'Create Fee Manager Contract',
      nextStep: 'We are now going to create the Fee Manager contract (responsible for calculating fees)',
      tx: () => factory.createFeeManager(environment.account!),
      step: 2,
    },
    FEE_MANAGER: {
      whatHappened: 'The Fee Manager Contract has been created.',
      name: 'Create Participation Contract',
      nextStep:
        'We are now going to create the Participation Contract (responsible for allowing investors into the fund)',
      tx: () => factory.createParticipation(environment.account!),
      step: 3,
    },
    PARTICIPATION: {
      whatHappened: 'The Participation Contract has been created.',
      name: 'Create Policy Manager Contract',
      nextStep:
        'We are now going to create the Policy Manager Contract (responsible for managing risk management and compliance policies)',
      tx: () => factory.createPolicyManager(environment.account!),
      step: 4,
    },
    POLICY_MANAGER: {
      whatHappened: 'The Policy Manager Contract has been created.',
      name: 'Create Shares Contract',
      nextStep: 'We are now going to create the Shares Contract (responsible for creating fund shares)',
      tx: () => factory.createShares(environment.account!),
      step: 5,
    },
    SHARES: {
      whatHappened: 'The Shares Contract has been created.',
      name: 'Create Trading Contract',
      nextStep: 'We are now going to create the Trading Contract (responsible for all trading activities of the fund)',
      tx: () => factory.createTrading(environment.account!),
      step: 6,
    },
    TRADING: {
      whatHappened: 'The Trading Contract has been created.',
      name: 'Create Vault Contract',
      nextStep: 'We are now going to create the Vault Contract (responsible for securely storing all assets)',
      tx: () => factory.createVault(environment.account!),
      step: 7,
    },
    VAULT: {
      whatHappened: 'The Vault Contract has been created.',
      name: 'Complete Setup',
      nextStep: 'We are now going to complete the fund setup (setting permissions, etc.)',
      tx: () => factory.completeSetup(environment.account!),
      step: 8,
    },
  };

  const progress = fund.progress;

  if (progress === 'COMPLETE') {
    history.push(`/fund/${fund.address}`);
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const tx = transactionPipeline[progress].tx();

    transaction.start(tx);
  };

  return (
    <>
      <p>
        {transactionPipeline[progress] && transactionPipeline[progress].whatHappened} (step{' '}
        {transactionPipeline[progress] && transactionPipeline[progress].step - 1}, {fund && fund.progress})
      </p>

      <p>&nbsp;</p>

      <p>{transactionPipeline[progress] && transactionPipeline[progress].nextStep}</p>

      <form onSubmit={submit}>
        <ButtonBlock>
          <SubmitButton label={transactionPipeline[progress] && transactionPipeline[progress].name} />
        </ButtonBlock>
      </form>

      <TransactionModal
        transaction={transaction}
        title={transactionPipeline[progress] && transactionPipeline[progress].name}
      />
    </>
  );
};
