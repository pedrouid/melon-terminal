import { useContext } from 'react';
import { Color } from '~/components/Contexts/Color/Color';

export const useColor = () => {
  return useContext(Color);
};
