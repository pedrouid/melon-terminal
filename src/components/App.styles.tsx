import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import { BaseModalBackground } from 'styled-react-modal';
import { darkTheme, lightTheme, Global } from '~/theme';
import { ColorProvider } from './Contexts/Color/Color';
import { useDarkMode } from '~/hooks/useDarkMode';

export const ModalBackground = styled(BaseModalBackground)`
  z-index: 2000;
`;

export const Theme: React.FC = ({ children }) => {
  const { isDarkMode } = useDarkMode();

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <ColorProvider default={theme.logoColors[0]}>
        <Reset />
        <Global />
        {children}
      </ColorProvider>
    </ThemeProvider>
  );
};
