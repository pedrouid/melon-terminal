import React from 'react';
import { useAccountFundQuery } from '~/queries/AccountFund';
import { Address } from '@melonproject/melonjs';
import { sameAddress } from '@melonproject/melonjs/utils/sameAddress';

export interface RequireFundManagerProps {
  address: Address;
}

export const RequiresFundManager: React.FC<RequireFundManagerProps> = props => {
  const [account, _] = useAccountFundQuery();

  if (
    account &&
    account.fund &&
    account.fund.progress === 'COMPLETE' &&
    sameAddress(account.fund.address, props.address)
  ) {
    return <>{props.children}</>;
  }

  return <></>;
};
