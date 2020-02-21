import React from 'react';
import { useDarkMode } from '~/hooks/useDarkMode';
import * as S from './DarkModeSwitch.styles';
import { Icons } from '../Icons/Icons';

export const DarkModeSwitch: React.FC = () => {
  const context = useDarkMode();
  const onClick = () => context.setDarkMode();

  if (context.isDarkMode) {
    return (
      <S.ButtonNight onClick={onClick}>
        <Icons name="SUN" size="small" />
      </S.ButtonNight>
    );
  }

  return (
    <S.ButtonDay onClick={onClick}>
      <Icons name="MOON" size="small" />
    </S.ButtonDay>
  );
};
