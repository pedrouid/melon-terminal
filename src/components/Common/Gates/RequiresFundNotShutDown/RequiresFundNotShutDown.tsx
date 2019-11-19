import React from 'react';
import { useAccountFundQuery } from '~/queries/AccountFund';
import { Address } from '@melonproject/melonjs';
import { sameAddress } from '@melonproject/melonjs/utils/sameAddress';

export interface RequireFundNotShutDownProps {
  address: Address;
}

export const RequiresFundNotShutDown: React.FC<RequireFundNotShutDownProps> = props => {
  const [account, _] = useAccountFundQuery();

  if (
    account &&
    account.fund &&
    account.fund.progress === 'COMPLETE' &&
    !account.fund.isShutDown &&
    sameAddress(account.fund.address, props.address)
  ) {
    return <>{props.children}</>;
  }

  return <></>;
};
