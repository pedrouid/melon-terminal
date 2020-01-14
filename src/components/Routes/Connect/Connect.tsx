import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { ConnectionStatus } from '~/components/Contexts/Connection/Connection';
import { useConnectionState } from '~/hooks/useConnectionState';
import { Container } from '~/storybook/components/Container/Container';
import { Title } from '~/storybook/components/Title/Title';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { Block } from '~/storybook/components/Block/Block';

export const Connect = () => {
  const history = useHistory();
  const connection = useConnectionState();
  const [method, setMethod] = useState<string>();

  useEffect(() => {
    if (connection.status === ConnectionStatus.CONNECTED && connection.method === method) {
      history.replace('/');
    }
  }, [connection.status, connection.method]);

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
          const select = () => {
            setMethod(method.name);
            connection.switch(method.name);
          };

          return (
            <GridRow key={method.name} justify="center">
              <GridCol xs={12} sm={6} md={4} lg={4}>
                <Block>
                  <Component active={active} select={select} />
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
