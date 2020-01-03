import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs } from '@storybook/addon-knobs';
import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import { Global, theme } from '~/theme';

addDecorator(withNotes);
addDecorator(withKnobs);
addDecorator(story => (
  <ThemeProvider theme={theme}>
    <>
      <Reset />
      <Global />
      {story()}
    </>
  </ThemeProvider>
));

configure(require.context('../', true, /\.stories\.tsx$/));
