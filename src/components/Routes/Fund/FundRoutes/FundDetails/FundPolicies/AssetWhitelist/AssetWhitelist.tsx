import React from 'react';
import { AssetWhitelistPolicy } from '~/queries/FundPolicies';
import { BodyCell } from '~/components/Common/Table/Table.styles';
import { Environment } from '~/environment';
import { findToken } from '@melonproject/melonjs';

interface AssetWhitelistProps {
  policy: AssetWhitelistPolicy;
  environment: Environment;
}

export const AssetWhitelist: React.FC<AssetWhitelistProps> = ({ policy, environment }) => {
  const addresses = policy.assetWhitelist
    .map(asset => findToken(environment.deployment, asset)!.symbol)
    .sort()
    .join(', ');

  return <BodyCell>{addresses}</BodyCell>;
};
