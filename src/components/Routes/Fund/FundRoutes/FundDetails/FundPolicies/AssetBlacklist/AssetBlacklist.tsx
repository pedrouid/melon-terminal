import React from 'react';
import { AssetBlacklistPolicy } from '~/queries/FundPolicies';
import { BodyCell } from '~/components/Common/Table/Table.styles';
import { DeployedEnvironment } from '@melonproject/melonjs';

interface AssetBlacklistProps {
  policy: AssetBlacklistPolicy;
  environment: DeployedEnvironment;
}

export const AssetBlacklist: React.FC<AssetBlacklistProps> = ({ policy, environment }) => {
  const addresses = policy.assetBlacklist
    .map(asset => environment.getToken(asset)!.symbol)
    .sort()
    .join(', ');

  return <BodyCell>{addresses}</BodyCell>;
};
