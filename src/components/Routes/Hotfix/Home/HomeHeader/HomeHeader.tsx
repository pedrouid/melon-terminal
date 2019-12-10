import React from 'react';
import * as S from './HomeHeader.styles';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';

export interface HomeHeaderProps {
  address: string;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ address }) => {
  const etherscanLink = useEtherscanLink({ address });

  return (
    <S.HomeHeader>
      <S.HomeHeaderHeadline>
        <S.HomeHeaderTitle>Your funds</S.HomeHeaderTitle>
        <S.HomeHeaderLinks>
          <a href={etherscanLink!}>{address}</a>
        </S.HomeHeaderLinks>
      </S.HomeHeaderHeadline>
    </S.HomeHeader>
  );
};
