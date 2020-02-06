import React, { createContext, useState } from 'react';
import { theme } from '~/theme';

export interface ColorContextValue {
  color: string;
  random: () => void;
}

export const Color = createContext<ColorContextValue>({} as ColorContextValue);

export interface ColorProviderProps {
  default: string;
}

function randomColor() {
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
