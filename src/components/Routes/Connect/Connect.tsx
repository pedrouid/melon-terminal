import React from 'react';
import { useConnectionState } from '~/hooks/useConnectionState';
import { Container } from '~/storybook/components/Container/Container';
import { Title } from '~/storybook/components/Title/Title';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { Block } from '~/storybook/components/Block/Block';

export const Connect = () => {
  const connection = useConnectionState();

  return (
    <Container>
      <Grid>
        <GridRow justify="center">
          <GridCol xs={12} sm={6} md={4} lg={4}>
            <Title>Select your preferred connection method</Title>
          </GridCol>
        </GridRow>

        {connection.methods.map(method => {
          const Component = method.component;
          const active = method.name === connection.method;
          const select = () => connection.switch(method.name);

          return (
            <GridRow key={method.name} justify="center">
              <GridCol xs={12} sm={6} md={4} lg={4}>
                <Block>
                  <Component active={active} select={select} disconnect={connection.disconnect} />
                </Block>
              </GridCol>
            </GridRow>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Connect;
