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
import { Table, HeaderCell, HeaderRow, BodyCell, BodyRow, NoEntries } from '~/components/Common/Table/Table.styles';

export interface FundPolicyParametersProps {
  policy: FundPolicy;
  environment: Environment;
}

const FundPolicyParameters: React.FC<FundPolicyParametersProps> = props => {
  switch (props.policy.type) {
    case 'MaxConcentration': {
      const policy = props.policy as MaxConcentrationPolicy;
      return <BodyCell>{policy.maxConcentration.dividedBy('1e16').toString()}%</BodyCell>;
    }

    case 'MaxPositions': {
      const policy = props.policy as MaxPositionsPolicy;
      return <BodyCell>{policy.maxPositions}</BodyCell>;
    }

    case 'PriceTolerance': {
      const policy = props.policy as PriceTolerancePolicy;
      return <BodyCell>{policy.priceTolerance.dividedBy('1e16').toString()}%</BodyCell>;
    }

    case 'AssetWhitelist': {
      const policy = props.policy as AssetWhitelistPolicy;
      const addresses = policy.assetWhitelist
        .map(asset => findToken(props.environment.deployment, asset)!.symbol)
        .sort()
        .join(', ');

      return <BodyCell>{addresses}</BodyCell>;
    }

    case 'AssetBlacklist': {
      const policy = props.policy as AssetBlacklistPolicy;
      const addresses = policy.assetBlacklist
        .map(asset => findToken(props.environment.deployment, asset)!.symbol)
        .sort()
        .join(', ');

      return <BodyCell>{addresses}</BodyCell>;
    }

    case 'UserWhitelist': {
      return <BodyCell>Not disclosed</BodyCell>;
    }

    case 'CustomPolicy': {
      return <BodyCell>Unknown</BodyCell>;
    }

    default: {
      return <BodyCell>Unknown</BodyCell>;
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
    return (
      <S.Wrapper>
        <S.Title>Policies</S.Title>
        <Spinner positioning="centered" />
      </S.Wrapper>
    );
  }

  return (
    <S.Wrapper>
      <S.Title>Policies</S.Title>
      {policies && policies.length > 0 ? (
        <Table>
          <thead>
            <HeaderRow>
              <HeaderCell>Name</HeaderCell>
              <HeaderCell>Parameter(s)</HeaderCell>
            </HeaderRow>
          </thead>
          <tbody>
            {policies.map(policy => (
              <BodyRow key={policy.address}>
                <BodyCell>{policy.identifier}</BodyCell>
                <FundPolicyParameters policy={policy} environment={environment} />
              </BodyRow>
            ))}
          </tbody>
        </Table>
      ) : (
        <NoEntries>No registered policies.</NoEntries>
      )}
    </S.Wrapper>
  );
};

export default FundPolicies;
