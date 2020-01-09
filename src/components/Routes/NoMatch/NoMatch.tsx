import React from 'react';
import { NotificationBar, NotificationContent } from '~/storybook/components/NotificationBar/NotificationBar';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';

export const NoMatch: React.FC = () => (
  <Grid>
    <GridRow>
      <GridCol sm={12} xs={12}>
        <NotificationBar kind="error">
          <NotificationContent>
            <span>Oops! We did not find the page you are looking for.</span>
          </NotificationContent>
        </NotificationBar>
      </GridCol>
    </GridRow>
  </Grid>
);

export default NoMatch;
