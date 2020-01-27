import React, { createContext, useState, useLayoutEffect } from 'react';
import { useLocation } from 'react-router';
import { theme } from '~/theme';

export interface ColorContextValue {
  color: string;
  random: () => void;
  reset: () => void;
}

export const Color = createContext<ColorContextValue>({} as ColorContextValue);

export interface ColorProviderProps {
  default: string;
}

function randomColor() {
  return theme.logoColors[Math.floor(Math.random() * theme.logoColors.length)];
}

export const ColorProvider: React.FC<ColorProviderProps> = props => {
  const location = useLocation()!;
  const [base, setBase] = useState(props.default);
  const [color, setColor] = useState(props.default);
  const reset = () => setColor(base);
  const random = () => setColor(randomColor());

  useLayoutEffect(() => {
    setBase(color || randomColor());
  }, [location.pathname]);

  const context = {
    color,
    random,
    reset,
  };

  return <Color.Provider value={context}>{props.children}</Color.Provider>;
};
