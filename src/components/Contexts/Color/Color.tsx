import React, { createContext, useState } from 'react';

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
  const [color, set] = useState(props.default);
  const reset = () => set(props.default);
  const random = () => set(`#${Math.floor(Math.random() * 16777215).toString(16)}`);

  const context = {
    color,
    random,
    reset,
  };

  return <Color.Provider value={context}>{props.children}</Color.Provider>;
};
