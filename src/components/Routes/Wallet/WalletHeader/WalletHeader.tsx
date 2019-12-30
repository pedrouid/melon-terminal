import React from 'react';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { useAccount } from '~/hooks/useAccount';
import * as S from './WalletHeader.styles';

export const WalletHeader: React.FC = () => {
  const account = useAccount();
  const etherscanLink = useEtherscanLink({ address: account.address });

  return (
    <S.WalletHeader>
      <S.WalletHeaderHeadline>
        <S.WalletHeaderTitle>Your wallet</S.WalletHeaderTitle>
        <S.WalletHeaderLinks>
          <a href={etherscanLink!}>{account.address!}</a>
        </S.WalletHeaderLinks>
      </S.WalletHeaderHeadline>
    </S.WalletHeader>
  );
};
