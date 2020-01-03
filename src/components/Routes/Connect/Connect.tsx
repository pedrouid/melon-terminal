import React from 'react';
import { ConnectionSelector } from '~/components/Common/ConnectionSelector/ConnectionSelector';

import { Container } from '~/storybook/components/Container/Container';
import { Title } from '~/storybook/components/Title/Title';

export const Connect = () => {
  return (
    <Container>
      <Title>Select your preferred connection method</Title>
      <ConnectionSelector />
    </Container>
  );
};

export default Connect;
