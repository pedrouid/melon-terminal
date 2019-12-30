import React from 'react';
import { AssetBlacklistPolicy } from '~/queries/FundPolicies';
import { BodyCell } from '~/components/Common/Table/Table.styles';
import { findToken, DeployedEnvironment } from '@melonproject/melonjs';

interface AssetBlacklistProps {
  policy: AssetBlacklistPolicy;
  environment: DeployedEnvironment;
}

export const AssetBlacklist: React.FC<AssetBlacklistProps> = ({ policy, environment }) => {
  const addresses = policy.assetBlacklist
    .map(asset => findToken(environment.deployment, asset)!.symbol)
    .sort()
    .join(', ');

  return <BodyCell>{addresses}</BodyCell>;
};
