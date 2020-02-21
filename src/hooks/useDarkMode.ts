import { useContext } from 'react';
import { DarkMode } from '~/components/Contexts/DarkMode/DarkMode';

export const useDarkMode = () => {
  return useContext(DarkMode);
};
