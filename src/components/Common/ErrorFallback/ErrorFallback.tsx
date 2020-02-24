import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Grid, GridRow } from '~/storybook/components/Grid/Grid';
import { NotificationBar, NotificationContent } from '~/storybook/components/NotificationBar/NotificationBar';
import { Container } from '~/storybook/components/Container/Container';

export const ErrorFallback: React.FC<FallbackProps> = ({ error, componentStack }) => {
  const errorReportingUri = encodeURI(
    `https://github.com/avantgardefinance/melon-terminal/issues/new?title=General error "${error?.message}";body=${error?.stack}`
  );

  return (
    <Container>
      <Grid>
        <GridRow>
          <NotificationBar kind="error">
            <NotificationContent>
              <p>
                <strong>Oops, something went wrong!</strong>
              </p>

              <p>Please reload the page in your browser (Ctrl/Cmd R) and try again.</p>

              <p>
                If the error does not disappear after reloading, please file an{' '}
                <a href={errorReportingUri} target="_blank">
                  error report
                </a>
                .
              </p>
            </NotificationContent>
          </NotificationBar>
        </GridRow>
      </Grid>
    </Container>
  );
};
