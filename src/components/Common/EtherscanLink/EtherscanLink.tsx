import React from 'react';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';

export interface EtherscanLinkProps {
  address?: string;
  hash?: string;
}

export const EtherscanLink: React.FC<EtherscanLinkProps> = props => {
  const link = useEtherscanLink({
    ...(props.address && { address: props.address }),
    ...(props.hash && { hash: props.hash }),
  });

  return (
    <a href={link!} target="_blank">
      {props.children || props.address || props.hash}
    </a>
  );
};
