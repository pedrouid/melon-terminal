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
  CustomPolicy,
  UserWhitelistPolicy,
} from '~/queries/FundPolicies';
import { findToken } from '~/utils/findToken';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Environment } from '~/environment';
import { Table, HeaderCell, HeaderRow, BodyCell, BodyRow, NoEntries } from '~/components/Common/Table/Table.styles';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';

interface FundPolicyDetailsProps {
  policy: FundPolicy;
  environment: Environment;
}

const FundPolicyDetails: React.FC<FundPolicyDetailsProps> = props => {
  const link = useEtherscanLink({ address: props.policy.address })!;

  // TODO: Instead, move each of these into its own component so we can properly use hooks for each.
  switch (props.policy.type) {
    case 'MaxConcentration': {
      const policy = props.policy as MaxConcentrationPolicy;

      return (
        <BodyRow>
          <BodyCell>{link ? <a href={link}>{policy.identifier}</a> : policy.identifier}</BodyCell>
          <BodyCell>{policy.maxConcentration.dividedBy('1e16').toString()}%</BodyCell>
        </BodyRow>
      );
    }

    case 'MaxPositions': {
      const policy = props.policy as MaxPositionsPolicy;

      return (
        <BodyRow>
          <BodyCell>{link ? <a href={link}>{policy.identifier}</a> : policy.identifier}</BodyCell>
          <BodyCell>{policy.maxPositions}</BodyCell>;
        </BodyRow>
      );
    }

    case 'PriceTolerance': {
      const policy = props.policy as PriceTolerancePolicy;

      return (
        <BodyRow>
          <BodyCell>{link ? <a href={link}>{policy.identifier}</a> : policy.identifier}</BodyCell>
          <BodyCell>{policy.priceTolerance.dividedBy('1e16').toString()}%</BodyCell>
        </BodyRow>
      );
    }

    case 'AssetWhitelist': {
      const policy = props.policy as AssetWhitelistPolicy;
      const addresses = policy.assetWhitelist
        .map(asset => findToken(props.environment.deployment, asset)!.symbol)
        .sort()
        .join(', ');

      return (
        <BodyRow>
          <BodyCell>{link ? <a href={link}>{policy.identifier}</a> : policy.identifier}</BodyCell>
          <BodyCell>{addresses}</BodyCell>
        </BodyRow>
      );
    }

    case 'AssetBlacklist': {
      const policy = props.policy as AssetBlacklistPolicy;
      const addresses = policy.assetBlacklist
        .map(asset => findToken(props.environment.deployment, asset)!.symbol)
        .sort()
        .join(', ');

      return (
        <BodyRow>
          <BodyCell>{link ? <a href={link}>{policy.identifier}</a> : policy.identifier}</BodyCell>
          <BodyCell>{addresses}</BodyCell>
        </BodyRow>
      );
    }

    case 'UserWhitelist': {
      const policy = props.policy as UserWhitelistPolicy;

      return (
        <BodyRow>
          <BodyCell>{link ? <a href={link}>{policy.identifier}</a> : policy.identifier}</BodyCell>
          <BodyCell>Not disclosed</BodyCell>
        </BodyRow>
      );
    }

    case 'CustomPolicy': {
      const policy = props.policy as CustomPolicy;

      return (
        <BodyRow>
          <BodyCell>{link ? <a href={link}>{policy.identifier}</a> : policy.identifier}</BodyCell>
          <BodyCell>Unknown</BodyCell>;
        </BodyRow>
      );
    }

    default: {
      return null;
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
              <FundPolicyDetails key={policy.address} policy={policy} environment={environment} />
            ))}
          </tbody>
        </Table>
      ) : (
          <NoEntries>No registered policies.</NoEntries>
        )}
    </S.Wrapper>
  );
};
