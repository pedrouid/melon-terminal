import React, { useContext } from 'react';

import { ProgressBarContext } from '../ProgressBar';
import * as S from './ProgressBarStep.styles';

export interface ProgressBarStepProps {
  step?: number;
}

export const ProgressBarStep: React.FC<ProgressBarStepProps> = ({ step = 0 }) => {
  const current = useContext(ProgressBarContext);

  const isSelected = step === 0 ? true : current >= step;
  const isLoading = current === step - 1;

  return (
    <S.Badge selected={isSelected}>
      {isLoading && <S.BadgeLoader />}
      <S.BadgeIndex>{step}</S.BadgeIndex>
    </S.Badge>
  );
};
