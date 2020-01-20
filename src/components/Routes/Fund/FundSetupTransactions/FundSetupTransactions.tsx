import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import * as R from 'ramda';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Button } from '~/storybook/components/Button/Button';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionReceipt } from 'web3-core';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Transaction } from '@melonproject/melonjs';
import { useAccountFundQuery } from '~/queries/AccountFund';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { NoMatch } from '~/components/Routes/NoMatch/NoMatch';
import { useHistory } from 'react-router';
import { versionContract } from '~/utils/deploymentContracts';
import { useAccount } from '~/hooks/useAccount';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { Block, BlockActions } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { GridCol, GridRow, Grid } from '~/storybook/components/Grid/Grid';
import {
  CheckboxContainer,
  CheckboxInput,
  CheckboxMask,
  CheckboxIcon,
  CheckboxLabel,
} from '~/storybook/components/Checkbox/Checkbox';

interface TransactionPipelineItem {
  previous: string;
  name?: string;
  end?: boolean;
  transaction?: () => Transaction<TransactionReceipt>;
}

interface TransactionPipeline {
  [key: string]: TransactionPipelineItem;
}

export const FundSetupTransactions: React.FC = () => {
  const [result, query] = useAccountFundQuery();
  const environment = useEnvironment()!;
  const account = useAccount();
  const history = useHistory();

  // TODO: This should use the version contract address of the fund that is being created.
  const factory = useMemo(() => versionContract(environment), [environment]);
  const pipeline: TransactionPipeline = useMemo(
    () => ({
      BEGIN: {
        name: 'Create Accounting Contract (Step 2 of 9)',
        previous: 'Begin Setup',
        transaction: () => factory.createAccounting(account.address!),
      },
      ACCOUNTING: {
        name: 'Create Fee Manager Contract (Step 3 of 9)',
        previous: 'Accounting Contract',
        transaction: () => factory.createFeeManager(account.address!),
      },
      FEE_MANAGER: {
        name: 'Create Participation Contract (Step 4 of 9)',
        previous: 'Fee Manager Contract',
        transaction: () => factory.createParticipation(account.address!),
      },
      PARTICIPATION: {
        name: 'Create Policy Manager Contract (Step 5 of 9)',
        previous: 'Participation Contract',
        transaction: () => factory.createPolicyManager(account.address!),
      },
      POLICY_MANAGER: {
        name: 'Create Shares Contract (Step 6 of 9)',
        previous: 'Policy Manager Contract',
        transaction: () => factory.createShares(account.address!),
      },
      SHARES: {
        name: 'Create Trading Contract (Step 7 of 9)',
        previous: 'Shares Contract',
        transaction: () => factory.createTrading(account.address!),
      },
      TRADING: {
        name: 'Create Vault Contract (Step 8 of 9)',
        previous: 'Trading Contract',
        transaction: () => factory.createVault(account.address!),
      },
      VAULT: {
        name: 'Complete Setup (Step 9 of 9)',
        previous: 'Vault Contract',
        transaction: () => factory.completeSetup(account.address!),
      },
      COMPLETE: {
        previous: 'Setup complete',
        transaction: () => factory.completeSetup(account.address!),
        end: true,
      },
    }),
    [factory, environment]
  );

  const pipelineOrder = [
    'BEGIN',
    'ACCOUNTING',
    'FEE_MANAGER',
    'PARTICIPATION',
    'POLICY_MANAGER',
    'SHARES',
    'TRADING',
    'VAULT',
    'COMPLETE',
  ];

  const fund = result ? result.fund : undefined;
  const progress = fund ? fund.progress : undefined;
  const step = progress ? (pipeline[progress] as TransactionPipelineItem) : undefined;
  const next = useMemo(() => step && step.transaction && step.transaction(), [step]);

  const [checked, setChecked] = useState<boolean[]>();

  const [acknowledged, setAcknowledged] = useState(!!(history.location.state && history.location.state.start));
  const refetch = useOnChainQueryRefetcher();
  const transaction = useTransaction(environment, {
    onStart: () => setAcknowledged(false),
    onFinish: receipt => refetch(receipt.blockNumber),
    onAcknowledge: () => setAcknowledged(true),
  });

  useEffect(() => {
    const index = pipelineOrder.findIndex(item => item === progress);
    const newChecked = R.range(0, index + 1).map(() => true);
    setChecked(newChecked);

    if (acknowledged && progress === 'COMPLETE') {
      return history.push(`/fund/${fund!.address}`);
    }

    if (acknowledged && next) {
      return transaction.start(next, step!.name!);
    }
  }, [progress, next, acknowledged]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    next && transaction.start(next, step!.name!);
  };

  return (
    <Grid>
      <GridRow justify="center">
        <GridCol xs={12} sm={10} md={8} lg={6}>
          <Block>
            <SectionTitle>Fund setup transactions</SectionTitle>
            {query.loading && <Spinner />}
            {!query.loading && !step && <NoMatch />}
            {!query.loading && step && (
              <>
                <ul>
                  {pipelineOrder.map((item, index) => {
                    return (
                      <li key={item}>
                        <CheckboxContainer>
                          <CheckboxInput
                            type="checkbox"
                            name={item}
                            value={item}
                            key={item}
                            defaultChecked={checked && checked[index]}
                            disabled={true}
                          />
                          <CheckboxMask>
                            <CheckboxIcon></CheckboxIcon>
                          </CheckboxMask>
                          <CheckboxLabel htmlFor="1">{pipeline[item].previous}</CheckboxLabel>
                        </CheckboxContainer>
                      </li>
                    );
                  })}
                </ul>
                {!step.end && (
                  <form onSubmit={submit}>
                    <BlockActions>
                      <Button>{step.name!}</Button>
                    </BlockActions>
                  </form>
                )}
              </>
            )}

            <TransactionModal transaction={transaction} />
          </Block>
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export default FundSetupTransactions;
