import React from 'react';
import { Address } from '@melonproject/melonjs';
import { useFundDetailsQuery } from '~/queries/FundDetails';

export interface RequireFundNotShutDownProps {
  address: Address;
}

export const RequiresFundNotShutDown: React.FC<RequireFundNotShutDownProps> = props => {
  const [fund, _] = useFundDetailsQuery(props.address);

  if (fund && !fund.isShutDown) {
    return <>{props.children}</>;
  }

  return <></>;
};
