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
import { useEnvironment } from '~/hooks/useEnvironment';
import { Environment } from '~/environment';
import { Table, HeaderCell, HeaderRow, NoEntries } from '~/components/Common/Table/Table.styles';
import { MaxConcentration } from './MaxConcentration/MaxConcentration';
import { CustomPolicy } from './CustomPolicy/CustomPolicy';
import { MaxPositions } from './MaxPositions/MaxPositions';
import { PriceTolerance } from './PriceTolerance/PriceTolerance';
import { AssetWhitelist } from './AssetWhitelist/AssetWhitelist';
import { AssetBlacklist } from './AssetBlacklist/AssetBlacklist';
import { UserWhitelist } from './UserWhitelist/UserWhitelist';

interface FundPolicyDetailsProps {
  policy: FundPolicy;
  environment: Environment;
}

export const FundPolicyDetails: React.FC<FundPolicyDetailsProps> = props => {
  // TODO: Instead, move each of these into its own component so we can properly use hooks for each.
  switch (props.policy.type) {
    case 'MaxConcentration': {
      return <MaxConcentration policy={props.policy as MaxConcentrationPolicy} />;
    }

    case 'MaxPositions': {
      return <MaxPositions policy={props.policy as MaxPositionsPolicy} />;
    }

    case 'PriceTolerance': {
      return <PriceTolerance policy={props.policy as PriceTolerancePolicy} />;
    }

    case 'AssetWhitelist': {
      return <AssetWhitelist policy={props.policy as AssetWhitelistPolicy} environment={props.environment} />;
    }

    case 'AssetBlacklist': {
      return <AssetBlacklist policy={props.policy as AssetBlacklistPolicy} environment={props.environment} />;
    }

    case 'UserWhitelist': {
      return <UserWhitelist />;
    }

    case 'CustomPolicy': {
      return <CustomPolicy />;
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
  const [policies, _, query] = useFundPoliciesQuery(address);
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
