import React from 'react';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import * as S from './FundPolicies.styles';
import {
  useFundPoliciesQuery,
  MaxConcentrationPolicy,
  MaxPositionsPolicy,
  PriceTolerancePolicy,
  FundPolicy,
  AssetWhitelistPolicy,
  AssetBlacklistPolicy,
} from '~/queries/FundPolicies';
import { findToken } from '~/utils/findToken';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Environment } from '~/environment';

export interface FundPolicyParametersProps {
  policy: FundPolicy;
  environment: Environment;
}

const FundPolicyParameters: React.FC<FundPolicyParametersProps> = props => {
  switch (props.policy.type) {
    case 'MaxConcentration': {
      const policy = props.policy as MaxConcentrationPolicy;
      return <S.BodyCell>{policy.maxConcentration.dividedBy('1e16').toString()}%</S.BodyCell>;
    }

    case 'MaxPositions': {
      const policy = props.policy as MaxPositionsPolicy;
      return <S.BodyCell>{policy.maxPositions}</S.BodyCell>;
    }

    case 'PriceTolerance': {
      const policy = props.policy as PriceTolerancePolicy;
      return <S.BodyCell>{policy.priceTolerance.dividedBy('1e16').toString()}%</S.BodyCell>;
    }

    case 'AssetWhitelist': {
      const policy = props.policy as AssetWhitelistPolicy;
      const addresses = policy.assetWhitelist
        .map(asset => findToken(props.environment.deployment, asset)!.symbol)
        .sort()
        .join(', ');

      return <S.BodyCell>{addresses}</S.BodyCell>;
    }

    case 'AssetBlacklist': {
      const policy = props.policy as AssetBlacklistPolicy;
      const addresses = policy.assetBlacklist
        .map(asset => findToken(props.environment.deployment, asset)!.symbol)
        .sort()
        .join(', ');

      return <S.BodyCell>{addresses}</S.BodyCell>;
    }

    case 'UserWhitelist': {
      return <S.BodyCell>Not disclosed</S.BodyCell>;
    }

    case 'CustomPolicy': {
      return <S.BodyCell>Unknown</S.BodyCell>;
    }

    default: {
      return <S.BodyCell>Unknown</S.BodyCell>;
    }
  }
};

export interface FundPoliciesProps {
  address: string;
}

export const FundPolicies: React.FC<FundPoliciesProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const [policies, query] = useFundPoliciesQuery(address);
  if (query.loading) {
    return <Spinner positioning="centered" />;
  }

  if (!policies) {
    return null;
  }

  return (
    <S.Wrapper>
      <S.Title>Policies</S.Title>
      <S.Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Parameter</th>
          </tr>
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
    </S.Wrapper>
  );
};

export default FundPolicies;
