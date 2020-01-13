import React, { useState } from 'react';
import * as S from './FundRegisterPolicies.styles';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useFundPoliciesQuery } from '~/queries/FundPolicies';
import { FundPolicyListParameters } from '../../../FundPolicyList/FundPolicyList';
import {
  PolicyManager,
  PriceTolerance,
  Deployment,
  MaxConcentration,
  MaxPositions,
  UserWhitelist,
  AssetWhitelist,
  AssetBlacklist,
  PolicyDefinition,
} from '@melonproject/melonjs';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { PriceToleranceConfiguration } from './PriceToleranceConfiguration/PriceToleranceConfiguration';
import { MaxPositionsConfiguration } from './MaxPositionsConfiguration/MaxPositionsConfiguration';
import { MaxConcentrationConfiguration } from './MaxConcentrationConfiguration/MaxConcentrationConfiguration';
import { UserWhitelistConfiguration } from './UserWhitelistConfiguration/UserWhitelistConfiguration';
import { AssetWhitelistConfiguration } from './AssetWhitelistConfiguration/AssetWhitelistConfiguration';
import { AssetBlacklistConfiguration } from './AssetBlacklistConfiguration/AssetBlacklistConfiguration';
import { useAccount } from '~/hooks/useAccount';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Spinner } from '~/storybook/components/Spinner/Spinner';

export interface RegisterPoliciesProps {
  address: string;
}

export const RegisterPolicies: React.FC<RegisterPoliciesProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const account = useAccount()!;
  const refetch = useOnChainQueryRefetcher();
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyDefinition>();
  const [policyManager, query] = useFundPoliciesQuery(address);

  const transaction = useTransaction(environment, {
    onAcknowledge: receipt => {
      if (receipt.contractAddress && selectedPolicy) {
        const manager = new PolicyManager(environment, policyManager!.address);
        const signatures = selectedPolicy.signatures;
        const addresses = Array.from(Array(selectedPolicy.signatures.length).keys()).map(
          () => receipt.contractAddress!
        );

        const tx = manager.batchRegisterPolicies(account.address!, signatures, addresses);
        transaction.start(tx, `Register ${selectedPolicy.name} policy`);
      }
    },
    onFinish: () => refetch(),
  });

  const startTransaction = (
    tx: Deployment<PriceTolerance | MaxPositions | MaxConcentration | UserWhitelist | AssetWhitelist | AssetBlacklist>,
    name: string
  ) => transaction.start(tx, name);

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Configure fund ruleset</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle>Configure fund ruleset</SectionTitle>
      <p>Configure the risk management profile of your fund and the rules to be enforced by the smart contracts.</p>

      <p>Please select the policy that you want to add:</p>
      <ul>
        {environment.policies.map(policy => {
          return (
            <li key={policy.name}>
              <input type="radio" id={policy.name} name="addPolicy" onClick={() => setSelectedPolicy(policy)} />
              <label htmlFor={policy.name}>{policy.name}</label>
            </li>
          );
        })}
      </ul>
      <p>&nbsp;</p>

      {policyManager && selectedPolicy && selectedPolicy.id === 'priceTolerance' && (
        <PriceToleranceConfiguration
          policyManager={policyManager.address!}
          policy={selectedPolicy}
          startTransaction={startTransaction}
        />
      )}

      {policyManager && selectedPolicy && selectedPolicy.id === 'maxPositions' && (
        <MaxPositionsConfiguration
          policyManager={policyManager.address!}
          policy={selectedPolicy}
          startTransaction={startTransaction}
        />
      )}

      {policyManager && selectedPolicy && selectedPolicy.id === 'maxConcentration' && (
        <MaxConcentrationConfiguration
          policyManager={policyManager.address!}
          policy={selectedPolicy}
          startTransaction={startTransaction}
        />
      )}

      {policyManager && selectedPolicy && selectedPolicy.id === 'userWhitelist' && (
        <UserWhitelistConfiguration
          policyManager={policyManager.address!}
          policy={selectedPolicy}
          startTransaction={startTransaction}
        />
      )}

      {policyManager && selectedPolicy && selectedPolicy.id === 'assetWhitelist' && (
        <AssetWhitelistConfiguration
          policyManager={policyManager.address!}
          policy={selectedPolicy}
          startTransaction={startTransaction}
        />
      )}

      {policyManager && selectedPolicy && selectedPolicy.id === 'assetBlacklist' && (
        <AssetBlacklistConfiguration
          policyManager={policyManager.address!}
          policy={selectedPolicy}
          startTransaction={startTransaction}
        />
      )}

      <TransactionModal transaction={transaction} />
    </Block>
  );
};

export default RegisterPolicies;
