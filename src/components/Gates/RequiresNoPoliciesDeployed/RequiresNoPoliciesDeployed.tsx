import React from 'react';
import BigNumber from 'bignumber.js';
import { useFundPoliciesQuery } from '~/queries/FundPolicies';

export interface RequiresNoPoliciesDeployedProps {
  address: string;
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
}

export const RequiresNoPoliciesDeployed: React.FC<RequiresNoPoliciesDeployedProps> = ({
  loader,
  children,
  fallback = true,
  address,
}) => {
  const [policyManager, query] = useFundPoliciesQuery(address);

  if (query.loading) {
    return loader || null;
  }

  const policies = policyManager?.policies || [];

  if (policies.length === 0) {
    return <>{children}</>;
  }

  const output = fallback === true ? 'The fund needs to have no deployed policies to access this page' : fallback;
  return <>{output || null}</>;
};
