import React from 'react';
import * as S from './WalletHeader.styles';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';

export interface WalletHeaderProps {
  address: string;
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({ address }) => {
  const etherscanLink = useEtherscanLink({ address });

  return (
    <S.WalletHeader>
      <S.WalletHeaderHeadline>
        <S.WalletHeaderTitle>Your wallet</S.WalletHeaderTitle>
        <S.WalletHeaderLinks>
          <a href={etherscanLink!}>{address}</a>
        </S.WalletHeaderLinks>
      </S.WalletHeaderHeadline>
    </S.WalletHeader>
  );
};
