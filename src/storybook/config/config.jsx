import React, { useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { configure, addDecorator } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs } from '@storybook/addon-knobs';
import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import { Global, lightTheme, darkTheme } from '~/theme';
import { ColorProvider } from '~/components/Contexts/Color/Color';
import { Button } from '../components/Button/Button';

const DarkModeContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`;

addDecorator(withNotes);
addDecorator(withKnobs);
addDecorator(story => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <>
      <DarkModeContainer>
        <Button onClick={() => setIsDarkMode(!isDarkMode)} theme={theme}>
          DARK MODE
        </Button>
      </DarkModeContainer>
      <ThemeProvider theme={theme}>
        <Router>
          <Reset />
          <Global />
          <ColorProvider default={theme.otherColors.logo}>{story()}</ColorProvider>
        </Router>
      </ThemeProvider>
    </>
  );
});

configure(require.context('../', true, /\.stories\.tsx$/), module);
