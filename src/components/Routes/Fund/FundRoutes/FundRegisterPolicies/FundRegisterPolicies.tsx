import React, { useState } from 'react';
import * as R from 'ramda';
import * as S from './FundRegisterPolicies.styles';
import { availablePolicies, AvailablePolicy } from '~/utils/availablePolicies';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useFundPoliciesQuery } from '~/queries/FundPolicies';
import { FundPolicyParameters } from '../FundDetails/FundPolicies/FundPolicies';
import {
  PolicyManager,
  PriceTolerance,
  Deployment,
  MaxConcentration,
  MaxPositions,
  UserWhitelist,
  AssetWhitelist,
  AssetBlacklist,
} from '@melonproject/melonjs';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { PriceToleranceConfiguration } from './PriceToleranceConfiguration/PriceToleranceConfiguration';
import { MaxPositionsConfiguration } from './MaxPositionsConfiguration/MaxPositionsConfiguration';
import { MaxConcentrationConfiguration } from './MaxConcentrationConfiguration/MaxConcentrationConfiguration';
import { UserWhitelistConfiguration } from './UserWhitelistConfiguration/UserWhitelistConfiguration';
import { AssetWhitelistConfiguration } from './AssetWhitelistConfiguration/AssetWhitelistConfiguration';
import { AssetBlacklistConfiguration } from './AssetBlacklistConfiguration/AssetBlacklistConfiguration';

export interface RegisterPoliciesProps {
  address: string;
}

export const RegisterPolicies: React.FC<RegisterPoliciesProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const [selectedPolicy, setSelectedPolicy] = useState<AvailablePolicy>();

  const [policyManager, query] = useFundPoliciesQuery(address);

  const transaction = useTransaction(environment, {
    onAcknowledge: receipt => {
      if (receipt.contractAddress && selectedPolicy) {
        const manager = new PolicyManager(environment, policyManager.address);

        const signatures = selectedPolicy.signatures;
        const addresses = R.range(0, selectedPolicy.signatures.length || 0).map(() => receipt.contractAddress!);

        const tx = manager.batchRegisterPolicies(environment.account!, signatures, addresses);
        transaction.start(tx, `Register ${selectedPolicy.name} policy`);
      }
    },
    onFinish: receipt => {
      if (!receipt.contractAddress) {
        query.refetch();
      }
    },
  });

  const policies = policyManager && policyManager.policies;

  const startTransaction = (
    tx: Deployment<PriceTolerance | MaxPositions | MaxConcentration | UserWhitelist | AssetWhitelist | AssetBlacklist>,
    name: string
  ) => transaction.start(tx, name);

  return (
    <>
      <S.FundPoliciesBody>
        <h1>Risk Profile</h1>
        <p>Configure the risk management profile of your fund and the rules to be enforced by the smart contracts.</p>
        <p>&nbsp;</p>

        <h3>Available policies ({availablePolicies.length})</h3>
        <p>Please select the policy that you want to add:</p>
        <ul>
          {availablePolicies.map(policy => {
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
            policyManager={policyManager.address}
            policy={selectedPolicy}
            startTransaction={startTransaction}
          ></PriceToleranceConfiguration>
        )}

        {policyManager && selectedPolicy && selectedPolicy.id === 'maxPositions' && (
          <MaxPositionsConfiguration
            policyManager={policyManager.address}
            policy={selectedPolicy}
            startTransaction={startTransaction}
          ></MaxPositionsConfiguration>
        )}

        {policyManager && selectedPolicy && selectedPolicy.id === 'maxConcentration' && (
          <MaxConcentrationConfiguration
            policyManager={policyManager.address}
            policy={selectedPolicy}
            startTransaction={startTransaction}
          ></MaxConcentrationConfiguration>
        )}

        {policyManager && selectedPolicy && selectedPolicy.id === 'userWhitelist' && (
          <UserWhitelistConfiguration
            policyManager={policyManager.address}
            policy={selectedPolicy}
            startTransaction={startTransaction}
          ></UserWhitelistConfiguration>
        )}

        {policyManager && selectedPolicy && selectedPolicy.id === 'assetWhitelist' && (
          <AssetWhitelistConfiguration
            policyManager={policyManager.address}
            policy={selectedPolicy}
            startTransaction={startTransaction}
          ></AssetWhitelistConfiguration>
        )}

        {policyManager && selectedPolicy && selectedPolicy.id === 'assetBlacklist' && (
          <AssetBlacklistConfiguration
            policyManager={policyManager.address}
            policy={selectedPolicy}
            startTransaction={startTransaction}
          ></AssetBlacklistConfiguration>
        )}

        <p>&nbsp;</p>

        <h3>Active policies (0)</h3>
        {policies && policies.length > 0 ? (
          <S.Table>
            <thead>
              <S.HeaderRow>
                <S.HeaderCell>Name</S.HeaderCell>
                <S.HeaderCell>Parameter(s)</S.HeaderCell>
              </S.HeaderRow>
            </thead>
            <tbody>
              {policies.map(policy => (
                <S.BodyRow key={policy.address}>
                  <S.BodyCell>{policy.identifier}</S.BodyCell>
                  <FundPolicyParameters policy={policy} environment={environment} />
                </S.BodyRow>
              ))}
            </tbody>
          </S.Table>
        ) : (
          <S.NoRegisteredPolicies>No registered policies.</S.NoRegisteredPolicies>
        )}
      </S.FundPoliciesBody>

      <TransactionModal transaction={transaction} />
    </>
  );
};

export default RegisterPolicies;
