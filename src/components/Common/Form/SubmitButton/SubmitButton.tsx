import * as S from './SubmitButton.styles';
import React from 'react';

export interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ label, ...rest }) => {
  return (
    <S.SubmitButtonWrapper type="submit" {...rest}>
      {label}
    </S.SubmitButtonWrapper>
  );
};
