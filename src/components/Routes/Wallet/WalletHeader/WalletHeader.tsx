import React from 'react';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { useAccount } from '~/hooks/useAccount';
import * as S from './WalletHeader.styles';

import { Title } from '~/storybook/components/Title/Title';

export const WalletHeader: React.FC = () => {
  const account = useAccount();
  const etherscanLink = useEtherscanLink({ address: account.address });

  return (
    <S.WalletHeader>
      <S.WalletHeaderHeadline>
        <Title>Your wallet</Title>
        <S.WalletHeaderLinks>
          <a href={etherscanLink!}>{account.address!}</a>
        </S.WalletHeaderLinks>
      </S.WalletHeaderHeadline>
    </S.WalletHeader>
  );
};
