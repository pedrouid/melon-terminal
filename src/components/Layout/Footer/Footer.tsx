import React from 'react';
import * as S from './Footer.styles';

export const Footer: React.FC = () => {
  return (
    <S.FooterPosition>
      <S.Footer>
        <S.FooterItem>
          <a href="https://melonprotocol.com">Protocol</a>
        </S.FooterItem>
        <S.FooterItem>
          <a href="https://github.com/Avantgarde-Finance/manager-interface/issues">Report an issue</a>
        </S.FooterItem>
      </S.Footer>
    </S.FooterPosition>
  );
};
