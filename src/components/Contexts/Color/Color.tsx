import React, { createContext, useState } from 'react';
import { lightTheme, darkTheme } from '~/theme';

export interface ColorContextValue {
  color: string;
  random: () => void;
}

export const Color = createContext<ColorContextValue>({} as ColorContextValue);

export interface ColorProviderProps {
  default: string;
}

function randomColor() {
  const isDarkMode = localStorage.getItem('isDarkMode');
  const theme = isDarkMode === 'true' ? darkTheme : lightTheme;

  return theme.logoColors[Math.floor(Math.random() * theme.logoColors.length)];
}

export const ColorProvider: React.FC<ColorProviderProps> = props => {
  const [color, setColor] = useState(props.default);
  const random = () => setColor(randomColor());

  const context = {
    color,
    random,
  };

  return <Color.Provider value={context}>{props.children}</Color.Provider>;
};
