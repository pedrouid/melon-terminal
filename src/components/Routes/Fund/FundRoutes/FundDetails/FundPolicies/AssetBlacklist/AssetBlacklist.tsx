import React from 'react';
import { AssetBlacklistPolicy } from '~/queries/FundPolicies';
import { BodyCell } from '~/components/Common/Table/Table.styles';
import { findToken } from '~/utils/findToken';
import { Environment } from '~/environment';

interface AssetBlacklistProps {
  policy: AssetBlacklistPolicy;
  environment: Environment;
}

export const AssetBlacklist: React.FC<AssetBlacklistProps> = ({ policy, environment }) => {
  const addresses = policy.assetBlacklist
    .map(asset => findToken(environment.deployment, asset)!.symbol)
    .sort()
    .join(', ');

  return <BodyCell>{addresses}</BodyCell>;
};
