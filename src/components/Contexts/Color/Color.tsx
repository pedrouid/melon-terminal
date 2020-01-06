import React, { createContext, useState, useLayoutEffect } from 'react';
import { useLocation } from 'react-router';

export interface ColorContextValue {
  color: string;
  random: () => void;
  reset: () => void;
}

export const Color = createContext<ColorContextValue>({} as ColorContextValue);

export interface ColorProviderProps {
  default: string;
}

export const ColorProvider: React.FC<ColorProviderProps> = props => {
  const location = useLocation()!;
  const [base, setBase] = useState(props.default);
  const [color, setColor] = useState(props.default);
  const reset = () => setColor(base);
  const random = () => setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);

  useLayoutEffect(() => {
    setBase(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  }, [location.pathname]);

  const context = {
    color,
    random,
    reset,
  };

  return <Color.Provider value={context}>{props.children}</Color.Provider>;
};
