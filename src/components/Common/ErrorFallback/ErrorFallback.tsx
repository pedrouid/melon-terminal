import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Grid, GridRow } from '~/storybook/components/Grid/Grid';
import { NotificationBar } from '~/storybook/components/NotificationBar/NotificationBar';
import { Container } from '~/storybook/components/Container/Container';

export const ErrorFallback: React.FC<FallbackProps> = ({ error, componentStack }) => (
  <Container>
    <Grid>
      <GridRow>
        <NotificationBar kind="error">
          <p>
            <strong>Oops! An error occured!</strong>
          </p>
          <p>Here’s what we know…</p>
          {error && (
            <p>
              <strong>Error:</strong> {error.toString()}
            </p>
          )}
          {componentStack && (
            <p>
              <strong>Stacktrace:</strong> {componentStack}
            </p>
          )}
        </NotificationBar>
      </GridRow>
    </Grid>
  </Container>
);
