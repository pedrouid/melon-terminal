import * as S from './SubmitButton.styles';
import React from 'react';

export interface SubmitButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  label: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ label, ...rest }) => {
  return (
    <S.SubmitButtonWrapper {...rest} type="submit">
      {label}
    </S.SubmitButtonWrapper>
  );
};
