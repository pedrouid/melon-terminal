import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import { BaseModalBackground } from 'styled-react-modal';
import { theme, Global } from '~/theme';
import { ColorProvider } from './Contexts/Color/Color';

export const ModalBackground = styled(BaseModalBackground)`
  z-index: 2000;
`;

export const Theme: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>
    <ColorProvider default={theme.otherColors.logo}>
      <Reset />
      <Global />
      {children}
    </ColorProvider>
  </ThemeProvider>
);
