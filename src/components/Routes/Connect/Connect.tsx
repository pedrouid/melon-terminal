import React from 'react';
import { ConnectionSelector } from '~/components/Common/ConnectionSelector/ConnectionSelector';

import { Container } from '~/storybook/components/Container/Container';
import { Title } from '~/storybook/components/Title/Title';
import { Grid, GridRow } from '~/storybook/components/Grid/Grid';

export const Connect = () => {
  return (
    <Container>
      <Grid>
        <GridRow>
          <Title>Select your preferred connection method</Title>
        </GridRow>
        <ConnectionSelector />
      </Grid>
    </Container>
  );
};

export default Connect;
