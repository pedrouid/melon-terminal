import React from 'react';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { toChecksumAddress } from 'web3-utils';

export interface EtherscanLinkProps {
  address?: string;
  hash?: string;
}

export const EtherscanLink: React.FC<EtherscanLinkProps> = props => {
  const args: EtherscanLinkProps = {
    ...(props.address && { address: toChecksumAddress(props.address) }),
    ...(props.hash && { hash: toChecksumAddress(props.hash) }),
  };

  const link = useEtherscanLink(args);

  return (
    <a href={link!} target="_blank">
      {args.address || args.hash}
    </a>
  );
};
