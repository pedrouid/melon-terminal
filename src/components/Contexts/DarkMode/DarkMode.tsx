import React, { createContext, useState } from 'react';

export interface DarkModeValue {
  isDarkMode: boolean;
  setDarkMode: () => void;
}

export const DarkMode = createContext<DarkModeValue>({} as DarkModeValue);

function storeDarkMode(isDarkMode: boolean) {
  return localStorage.setItem('isDarkMode', isDarkMode.toString());
}

export const DarkModeProvider: React.FC = props => {
  const stored = localStorage.getItem('isDarkMode');
  const [isDarkMode, setIsDarkMode] = useState(stored === 'true' ? true : false);

  const setDarkMode = () => {
    storeDarkMode(!isDarkMode);
    setIsDarkMode(!isDarkMode);
  };

  const context = {
    isDarkMode,
    setDarkMode,
  };

  return <DarkMode.Provider value={context}>{props.children}</DarkMode.Provider>;
};
