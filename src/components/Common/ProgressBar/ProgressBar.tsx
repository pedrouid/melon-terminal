import React, { useState } from 'react';
import { useSpring } from 'react-spring';

import * as S from './ProgressBar.styles';

export interface ProgressBarProps {
  progress: number;
  step?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, step }) => {
  const percentage = Math.min(100, Math.max(0, progress));
  const badges = Array(step).fill(0);

  const transitions = useSpring({ from: { width: '0%' }, to: { width: `${percentage}%` }, config: { duration: 500 } });

  return (
    <S.Container>
      <S.BadgeContainer>
        {step &&
          badges.map((badges: number, index: number) => {
            const progressStep = (100 / (step - 1)) * index;
            const selected = percentage >= progressStep;

            return (
              <S.Badge key={index} selected={selected}>
                {index}
              </S.Badge>
            );
          })}
      </S.BadgeContainer>
      <S.ProgressBar>
        <S.Progress style={transitions} />
      </S.ProgressBar>
    </S.Container>
  );
};
