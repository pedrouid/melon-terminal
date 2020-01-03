import React from 'react';
import * as S from './Header';
import { Logo } from '../Logo/Logo';
import { Link } from 'react-router-dom';

export default { title: 'Components|Header' };

export const Default: React.FC = () => {
  return (
    <S.HeaderPosition>
      <S.Header>
        <S.LogoContainer>
          <Logo name="with-bottom-text" size="small" />
        </S.LogoContainer>
        <S.Account>
          <S.AccountName>Name</S.AccountName>
          <S.AccountInfo>
            <S.AccountAddress>link</S.AccountAddress>
            <S.AccountNetwork>Live</S.AccountNetwork>
            <S.AccountBalance>ETH 1.00000</S.AccountBalance>
            <S.AccountInfoItem>Redy</S.AccountInfoItem>
          </S.AccountInfo>
        </S.Account>
      </S.Header>
    </S.HeaderPosition>
  );
};
