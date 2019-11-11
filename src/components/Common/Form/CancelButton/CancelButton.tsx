import * as S from './CancelButton.styles';
import React from 'react';

export interface CancelButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  label: string;
}

export const CancelButton: React.FC<CancelButtonProps> = ({ label, ...rest }) => {
  return (
    <S.CancelButtonWrapper {...rest} type="button">
      {label}
    </S.CancelButtonWrapper>
  );
};
