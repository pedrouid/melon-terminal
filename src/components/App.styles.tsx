import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import { BaseModalBackground } from 'styled-react-modal';
import { theme, Global } from '~/theme';

export const ModalBackground = styled(BaseModalBackground)`
  z-index: 2000;
`;

export const Theme: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>
    <>
      <Reset />
      <Global />
      {children}
    </>
  </ThemeProvider>
);
