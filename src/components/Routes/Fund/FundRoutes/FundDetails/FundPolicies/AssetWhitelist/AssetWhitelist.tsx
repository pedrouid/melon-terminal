import React from 'react';
import { AssetWhitelistPolicy } from '~/queries/FundPolicies';
import { BodyCell } from '~/components/Common/Table/Table.styles';
import { DeployedEnvironment } from '@melonproject/melonjs';

interface AssetWhitelistProps {
  policy: AssetWhitelistPolicy;
  environment: DeployedEnvironment;
}

export const AssetWhitelist: React.FC<AssetWhitelistProps> = ({ policy, environment }) => {
  const addresses = policy.assetWhitelist
    .map(asset => environment.getToken(asset)?.symbol ?? asset)
    .sort()
    .join(', ');

  return <BodyCell>{addresses}</BodyCell>;
};
