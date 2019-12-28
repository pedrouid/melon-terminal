import React from 'react';
import { AssetWhitelistPolicy } from '~/queries/FundPolicies';
import { BodyCell } from '~/components/Common/Table/Table.styles';
import { findToken } from '~/utils/findToken';
import { Environment } from '~/environment';

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
