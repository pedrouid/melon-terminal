import React from 'react';
import * as S from './ButtonBlock.styles';

export const ButtonBlock: React.FC = props => {
  return (
    <S.ButtonBlockWrapper>
      {React.Children.map(props.children, child => (
        <S.ButtonBlockButtonWrapper>{child}</S.ButtonBlockButtonWrapper>
      ))}
    </S.ButtonBlockWrapper>
  );
};
