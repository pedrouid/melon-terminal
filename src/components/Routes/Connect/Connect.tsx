import React from 'react';
import { ConnectionSelector } from './ConnectionSelector/ConnectionSelector';
import { Container } from '~/storybook/components/Container/Container';
import { Title } from '~/storybook/components/Title/Title';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';

export const Connect = () => {
  return (
    <Container>
      <Grid>
        <GridRow justify="center">
          <GridCol xs={12} sm={6} md={4} lg={4}>
            <Title>Select your preferred connection method</Title>
          </GridCol>
        </GridRow>
        <ConnectionSelector />
      </Grid>
    </Container>
  );
};

export default Connect;
