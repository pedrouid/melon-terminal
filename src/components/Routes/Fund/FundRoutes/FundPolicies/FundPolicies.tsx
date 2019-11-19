import React from 'react';
import * as S from './FundPolicies.styles';
import { availablePolicies } from '~/utils/availablePolicies';

export interface PoliciesProps {
  address: string;
}

export const Policies: React.FC<PoliciesProps> = ({ address }) => {
  return (
    <>
      <S.FundPoliciesBody>
        <h1>Risk Profile</h1>
        <p>Configure the risk management profile of your fund and the rules to be enforced by the smart contracts.</p>
        <p>&nbsp;</p>
        <h3>Active policies (0)</h3>
        <p>No active policies</p>

        <h3>Available policies ({availablePolicies.length})</h3>
        <p>Please select policies:</p>
        <ul>
          {availablePolicies.map(policy => {
            return <li key={policy.id}>{policy.name}</li>;
          })}
        </ul>
      </S.FundPoliciesBody>
    </>
  );
};

export default Policies;
