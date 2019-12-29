import * as S from './CancelButton.styles';
import React from 'react';

export interface CancelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const CancelButton: React.FC<CancelButtonProps> = ({ label, ...rest }) => {
  return (
    <S.CancelButtonWrapper type="button" {...rest}>
      {label}
    </S.CancelButtonWrapper>
  );
};
